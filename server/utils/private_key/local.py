from utils.private_key.base import BasePrivateKeyProvider

class LocalPrivateKeyProvider(BasePrivateKeyProvider):
    def get_private_key(self, secret_id: str) -> str:
        # if local, use secret_id itself as private key
        return secret_id