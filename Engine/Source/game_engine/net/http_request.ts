import { CHttpResponse, CHttpResponseFactory, CImageHttpResponse } from "./http_response";

// Type of the POST request body.
type RequestBodyT
    = Blob
    | BufferSource
    | FormData
    | URLSearchParams
    | ReadableStream
    | string;

// Simple asynchronous HTTP request wrapper.
export class CHttpRequest<T extends CHttpResponse>
{
    private mRequest: XMLHttpRequest;
    private mMethod: string;
    private mURL: string;
    private mBody: RequestBodyT;
    private mResponse: T;
    private mResponseFactory: CHttpResponseFactory<T>;
    private mOnResponseCb: ( response: T ) => any;

    //////////////////////////////////////////////////////////////////////////
    public SetOnResponseCallback( handler: ( response: T ) => any ): CHttpRequest<T>
    {
        this.mOnResponseCb = handler;
        return this;
    };

    //////////////////////////////////////////////////////////////////////////
    // @brief Create new HTTP request.
    public constructor( responseFactory: CHttpResponseFactory<T> )
    {
        this.mRequest = new XMLHttpRequest();
        this.mMethod = "GET";
        this.mURL = "/";
        this.mBody = null;
        this.mResponse = null;
        this.mResponseFactory = responseFactory;
    };

    //////////////////////////////////////////////////////////////////////////
    // @brief Set request method.
    // @param method [in] Valid request method.
    // @return Self pointer.
    public SetMethod( method: "GET" | "POST" ): CHttpRequest<T>
    {
        this.mMethod = method;
        return this;
    };

    //////////////////////////////////////////////////////////////////////////
    // @brief Set request body. GET requests ignore the body.
    // @param body [in] Body to send with POST request.
    // @return Self pointer.
    public SetBody( body?: RequestBodyT ): CHttpRequest<T>
    {
        this.mBody = body;
        return this;
    };

    //////////////////////////////////////////////////////////////////////////
    // @brief Set destination URL for the request.
    // @param url [in] Valid URL.
    // @return Self pointer.
    public SetURL( url: string ): CHttpRequest<T>
    {
        this.mURL = url;
        return this;
    };

    //////////////////////////////////////////////////////////////////////////
    // @brief Prepare and send the request to the server. The request is
    //  asynchronous.
    // @return True on success, false otherwise.
    public Send(): CHttpRequest<T>
    {
        try
        {
            this.mRequest.open( this.mMethod, this.mURL );

            // Send the request to the server, do not wait for the response
            this.mRequest.send( this.mBody );

            // WA for scope change
            let instance = this;
            this.mRequest.onreadystatechange =
                function ( this: XMLHttpRequest, ev: Event )
                { // Invoke instance method to return to CHttpRequest scope
                    instance.OnReadyStateChange( ev );
                };

            return this;
        }
        catch ( ex )
        {   // Send failed
            if ( ex instanceof DOMException )
                console.error( "Http request failed: " + ex.message );
        }
        return null;
    };

    //////////////////////////////////////////////////////////////////////////
    public IsResponseReady(): boolean
    {
        return this.mResponse != null;
    };

    //////////////////////////////////////////////////////////////////////////
    public GetResponse(): T
    {
        return this.mResponse;
    };

    //////////////////////////////////////////////////////////////////////////
    private OnReadyStateChange( ev: Event ): void
    {
        if ( this.mRequest.readyState != this.mRequest.DONE )
        { // The response has not arrived yet
            return;
        }

        switch ( this.mRequest.status )
        {
            case 200: this.OnLoad( ev ); return;
        }
    };

    //////////////////////////////////////////////////////////////////////////
    private OnLoad( ev: Event ): void
    {
        this.mResponse = this.mResponseFactory.Create();

        if ( this.mOnResponseCb != null )
        {
            this.mOnResponseCb( this.mResponse );
        }
    };
};

export class CImageHttpRequest extends CHttpRequest<CImageHttpResponse>
{ };
