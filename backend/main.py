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
    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600',
        }
        return '', 204, headers

    try:
        if "content-type" not in request.headers:
            raise ClientException("Require HTTP header 'Content-Type'")
        content_type = request.headers["content-type"]

        if content_type == "application/json":
            request_json = request.get_json(silent=True)
            if request_json and "room_id" in request_json and "time_limit" in request_json:
                room_id = request_json["room_id"]
                time_limit = request_json["time_limit"]
                c_weight = request_json["c_weight"] if "c_weight" in request_json else 3
                timeout = request_json["timeout"] if "timeout" in request_json else 3000
                num_unit_step = request_json["num_unit_step"] if "num_unit_step" in request_json else 10
            else:
                raise ClientException("JSON is invalid. Missing a 'room_id' or 'time_limit' property.")
        else:
            raise ClientException(f"Unknown content type: {content_type}")

        headers = {
            'Access-Control-Allow-Origin': '*',
        }

        return solver_resource.solve(room_id, time_limit, c_weight, timeout, num_unit_step), 200, headers

    except BaseException as e:
        return jsonify({"error": e.message}), e.code


if __name__ == "__main__":
    app = Flask(__name__)

    @app.route("/setlist_solver", methods=["POST"])
    def index():
        return solve(request)

    app.run("127.0.0.1", 8000, debug=True)
