from unittest import TestCase
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives import serialization

from utils.rsa import decrypt_token, encrypt_token


# 生成 RSA 密钥对
def generate_key_pair():
    private_key = rsa.generate_private_key(
        public_exponent=65537,
        key_size=2048,
    )
    public_key = private_key.public_key()

    # 保存私钥
    pem_private = private_key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.TraditionalOpenSSL,
        encryption_algorithm=serialization.NoEncryption(),
    )

    # 保存公钥
    pem_public = public_key.public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo,
    )

    return pem_private, pem_public


class TestEncryptionFunctions(TestCase):
    def test_generate_key_pair(self):
        # 测试密钥对生成是否成功
        private_key_pem, public_key_pem = generate_key_pair()
        self.assertIsNotNone(private_key_pem)
        self.assertIsNotNone(public_key_pem)
        self.assertTrue(isinstance(private_key_pem, bytes))
        self.assertTrue(isinstance(public_key_pem, bytes))

    def test_encrypt_decrypt(self):
        # 测试加密和解密功能
        private_key_pem, public_key_pem = generate_key_pair()
        token = "my_secret_token"

        # 测试加密
        encrypted_token = encrypt_token(public_key_pem, token)
        self.assertIsNotNone(encrypted_token)
        self.assertTrue(isinstance(encrypted_token, bytes))

        # 测试解密
        decrypted_token = decrypt_token(private_key_pem, encrypted_token)
        self.assertEqual(decrypted_token, token)

    def test_invalid_decrypt(self):
        # 测试使用错误的密钥解密
        private_key_pem, public_key_pem = generate_key_pair()
        another_private_key_pem, another_public_key_pem = generate_key_pair()
        token = "my_secret_token"

        # 使用第一个公钥加密
        encrypted_token = encrypt_token(public_key_pem, token)

        # 使用不同的私钥解密，应该失败
        with self.assertRaises(ValueError):
            decrypt_token(another_private_key_pem, encrypted_token)
