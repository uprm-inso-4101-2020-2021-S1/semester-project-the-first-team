from waitress import serve
from express_cut.wsgi import application

if __name__ == '__main__':
    print("hello")
    serve(application, port='8000')

