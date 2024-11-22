from typing import Dict
from fastapi import FastAPI, Request
from starlette.middleware.base import BaseHTTPMiddleware
import json
from pathlib import Path


class I18nConfig:
    def __init__(
        self, default_language: str = "en", translations_dir: str = "translations"
    ):
        self.default_language = default_language
        self.translations_dir = Path(translations_dir)
        self.translations: Dict[str, Dict] = {}
        self._load_translations()

    def _load_translations(self):
        """load translations from the translations directory"""
        if not self.translations_dir.exists():
            raise FileNotFoundError(
                f"Translations directory {self.translations_dir} not found"
            )

        for lang_file in self.translations_dir.glob("*.json"):
            lang_code = lang_file.stem
            with open(lang_file, "r", encoding="utf-8") as f:
                self.translations[lang_code] = json.load(f)

    def get_text(self, key: str, lang: str) -> str:
        if lang not in self.translations:
            lang = self.default_language
        return self.translations[lang].get(key, key)


class I18nMiddleware(BaseHTTPMiddleware):
    def __init__(self, app: FastAPI, i18n_config: I18nConfig):
        super().__init__(app)
        self.i18n_config = i18n_config

    async def dispatch(self, request: Request, call_next):
        lang = request.query_params.get(
            "lang", self.i18n_config.default_language
        ) or request.query_params.get("lang", self.i18n_config.default_language)

        request.state.i18n = self.i18n_config
        request.state.lang = lang

        response = await call_next(request)
        return response
