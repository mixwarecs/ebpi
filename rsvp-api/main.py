import asyncio
import json
import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Literal, Optional

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

BASE_DIR = Path(__file__).resolve().parent
GUESTS_PATH = BASE_DIR / ".." / "canon" / "public" / "boda" / "guests.json"
GUESTS_PRIVADO_PATH = BASE_DIR / "guests_privado.json"
RESPUESTAS_PATH = BASE_DIR / "respuestas.json"

# El valor real se pone en el Environment= de la unidad systemd en el servidor,
# nunca aqui en el codigo. El valor por defecto es solo para pruebas locales.
RESUMEN_TOKEN = os.environ.get("RESUMEN_TOKEN", "dev-local-only")

app = FastAPI()

with open(GUESTS_PATH, encoding="utf-8") as f:
    GUESTS_BY_ID = {g["id"]: g for g in json.load(f)}

TELEFONO_BY_ID = {}
if GUESTS_PRIVADO_PATH.exists():
    with open(GUESTS_PRIVADO_PATH, encoding="utf-8") as f:
        TELEFONO_BY_ID = {g["id"]: g.get("telefono", "") for g in json.load(f)}

_lock = asyncio.Lock()


def _load_respuestas() -> dict:
    if RESPUESTAS_PATH.exists():
        with open(RESPUESTAS_PATH, encoding="utf-8") as f:
            return json.load(f)
    return {}


def _save_respuestas(data: dict) -> None:
    tmp_path = RESPUESTAS_PATH.with_suffix(".json.tmp")
    with open(tmp_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    os.replace(tmp_path, RESPUESTAS_PATH)


class RsvpIn(BaseModel):
    id: str
    asistencia: Literal["si", "no"]
    adultos: Optional[int] = None
    ninos: Optional[int] = None


@app.post("/rsvp")
async def rsvp(payload: RsvpIn):
    if payload.id not in GUESTS_BY_ID:
        raise HTTPException(status_code=404, detail="invitado no encontrado")

    if payload.asistencia == "si":
        if payload.adultos is None or payload.adultos < 0:
            raise HTTPException(status_code=400, detail="adultos invalido")
        if payload.ninos is None or payload.ninos < 0:
            raise HTTPException(status_code=400, detail="ninos invalido")

    invitado = GUESTS_BY_ID[payload.id]

    async with _lock:
        respuestas = _load_respuestas()
        respuestas[payload.id] = {
            "nombre": invitado["nombre"],
            "apellido": invitado["apellido"],
            "asistencia": payload.asistencia,
            "adultos": payload.adultos if payload.asistencia == "si" else 0,
            "ninos": payload.ninos if payload.asistencia == "si" else 0,
            "respondido_en": datetime.now(timezone.utc).isoformat(),
        }
        _save_respuestas(respuestas)

    return {"ok": True}


@app.get("/rsvp/{guest_id}")
async def get_rsvp(guest_id: str):
    async with _lock:
        respuestas = _load_respuestas()
    if guest_id not in respuestas:
        raise HTTPException(status_code=404, detail="sin respuesta previa")
    return respuestas[guest_id]


@app.get("/resumen")
async def resumen(token: str = ""):
    if token != RESUMEN_TOKEN:
        raise HTTPException(status_code=404)

    async with _lock:
        respuestas = _load_respuestas()

    asisten = [r for r in respuestas.values() if r["asistencia"] == "si"]
    no_asisten = [r for r in respuestas.values() if r["asistencia"] == "no"]

    confirmados = [
        {
            "id": gid,
            "nombre": r["nombre"],
            "apellido": r["apellido"],
            "telefono": TELEFONO_BY_ID.get(gid, ""),
            "asistencia": r["asistencia"],
            "adultos": r["adultos"],
            "ninos": r["ninos"],
        }
        for gid, r in respuestas.items()
    ]

    pendientes = [
        {
            "id": gid,
            "nombre": g["nombre"],
            "apellido": g["apellido"],
            "telefono": TELEFONO_BY_ID.get(gid, ""),
        }
        for gid, g in GUESTS_BY_ID.items()
        if gid not in respuestas
    ]

    return {
        "total_invitados": len(GUESTS_BY_ID),
        "total_respondidos": len(respuestas),
        "total_pendientes": len(GUESTS_BY_ID) - len(respuestas),
        "hogares_asisten": len(asisten),
        "hogares_no_asisten": len(no_asisten),
        "adultos_confirmados": sum(r["adultos"] for r in asisten),
        "ninos_confirmados": sum(r["ninos"] for r in asisten),
        "confirmados": confirmados,
        "pendientes": pendientes,
    }
