from flask import Flask, Request, jsonify, request
from src.driver import FirestoreDriverImpl
from src.interactor import SolverInteractor
from src.repository import RoomRepositoryImpl
from src.rest import BaseException, ClientException, SolverResource

solver_resource = SolverResource(
    solver_usecase=SolverInteractor(
        room_repository=RoomRepositoryImpl(
            firestore_driver=FirestoreDriverImpl()
        )
    )
)


def solve(request: Request):
    try:
        if 'content-type' not in request.headers:
            raise ClientException("Require HTTP header 'Content-Type'")
        content_type = request.headers['content-type']

        if content_type == 'application/json':
            request_json = request.get_json(silent=True)
            if request_json and 'room_id' in request_json and 'time_limit' in request_json:
                room_id = request_json['room_id']
                time_limit = request_json['time_limit']
            else:
                raise ClientException("JSON is invalid. Missing a 'room_id' or 'time_limit' property.")
        else:
            raise ClientException(f"Unknown content type: {content_type}")

        return solver_resource.solve(room_id, time_limit)

    except BaseException as e:
        return jsonify({'error': e.message}), e.code


if __name__ == "__main__":
    app = Flask(__name__)

    @app.route('/solve', methods=["POST"])
    def index():
        return solve(request)

    app.run('127.0.0.1', 8000, debug=True)
