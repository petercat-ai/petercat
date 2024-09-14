

from fastapi.responses import JSONResponse


class PurchaseServer():
  def purchased(self, payload: dict):
    print(f"purchased={payload}")
    return JSONResponse(content={"status": "ok"}, status_code=200)