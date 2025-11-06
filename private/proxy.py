from flask import Flask,request,Response,send_file,redirect

import requests

app = Flask(__name__,static_url_path='/ejeojfoejfoejfoej')

HOST = "https://healo.infiheal.com"

@app.route('/',  methods=["GET", "POST"])
def index():
    return redirect("/chatbot")  # ref. https://medium.com/@zwork101/making-a-flask-proxy-server-online-in-10-lines-of-code-44b8721bca6

@app.route('/<path:path>', methods=["GET", "POST"])  # NOTE: better to specify which methods to be accepted. Otherwise, only GET will be accepted. Ref: https://flask.palletsprojects.com/en/3.0.x/quickstart/#http-methods
def redirect_to_API_HOST(path):  #NOTE var :path will be unused as all path we need will be read from :request ie from flask import request
    #print(request.url.replace(request.host_url, f'{HOST}/'))
    if "healoicon.png" in path:
        return send_file("icon.png")
    res = requests.request(  # ref. https://stackoverflow.com/a/36601467/248616
        method          = request.method,
        url             = request.url.replace(request.host_url, f'{HOST}/'),
        headers         = {k:v for k,v in request.headers if k.lower() != 'host'}, # exclude 'host' header
        data            = request.get_data(),
        cookies         = request.cookies,
        allow_redirects = False,
    )

    #region exlcude some keys in :res response
    excluded_headers = ['content-encoding', 'content-length', 'transfer-encoding', 'connection',"cache-control"]  #NOTE we here exclude all "hop-by-hop headers" defined by RFC 2616 section 13.5.1 ref. https://www.rfc-editor.org/rfc/rfc2616#section-13.5.1
    headers          = [
        (k,v) for k,v in res.raw.headers.items()
        if k.lower() not in excluded_headers
    ]
    #endregion exlcude some keys in :res response
    content = res.content
    print("static/js/main" in path,path.endswith('.js'),path)
    if "static/js/main" in path and path.endswith('.js'):
        print("CAHngED")
        content+=f"\n{open('inject.js').read()}".encode()
    response = Response(content, res.status_code, headers)
    return response


app.run(port=80)
