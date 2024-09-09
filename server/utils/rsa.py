from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives.serialization import load_pem_private_key, load_pem_public_key

# 加密 token
def encrypt_token(public_key_pem: str, token):
    public_key = load_pem_public_key(public_key_pem)
    encrypted_token = public_key.encrypt(
        token.encode(),
        padding.OAEP(
            mgf=padding.MGF1(algorithm=hashes.SHA256()),
            algorithm=hashes.SHA256(),
            label=None
        )
    )
    return encrypted_token

# 解密 token
def decrypt_token(private_key_pem, encrypted_token):
    private_key = load_pem_private_key(private_key_pem, password=None)
    decrypted_token = private_key.decrypt(
        encrypted_token,
        padding.OAEP(
            mgf=padding.MGF1(algorithm=hashes.SHA256()),
            algorithm=hashes.SHA256(),
            label=None
        )
    )
    return decrypted_token.decode()
