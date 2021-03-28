class BaseException(Exception):
    code = 0
    message = ''

    def __init__(self, code, message):
        self.code = code
        self.message = message


class ServerException(BaseException):
    def __init__(self, message):
        super().__init__(500, message)


class ClientException(BaseException):
    def __init__(self, message):
        super().__init__(400, message)
