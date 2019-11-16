from itsdangerous import JSONWebSignatureSerializer as Serializer, BadSignature, SignatureExpired

from time import time

secret_key = "haojeremyleekyisophie"
def generate_token(username):
        info = {
            'username': username,
            'creation_time': time()
        }
        s = Serializer(secret_key)
        token = s.dumps(info)
        return token.decode()

def validate_token(token, expires_in=600):
        try:
                s = Serializer(secret_key)
                info = s.loads(token.encode())
        except:
                return "wrong"
        
        if time() - info['creation_time'] > expires_in:
            return "expired"

        return info['username']
