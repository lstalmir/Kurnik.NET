
export abstract class CHttpResponse
{ };

export abstract class CHttpResponseFactory<T extends CHttpResponse>
{
    protected mResponseData: string;

    //////////////////////////////////////////////////////////////////////////
    public SetResponseData( data: string ): CHttpResponseFactory<T>
    {
        this.mResponseData = data;
        return this;
    };

    //////////////////////////////////////////////////////////////////////////
    public abstract Create(): T;
};

export class CImageHttpResponse extends CHttpResponse
{
    private mImageData: string;

    //////////////////////////////////////////////////////////////////////////
    // @brief Construct new image response and initialize it with the raw
    //  data from the HTTP response body.
    // @param imageData [in] Image data.
    public constructor( imageData: string )
    {
        super();
        this.mImageData = imageData;
    };

    //////////////////////////////////////////////////////////////////////////
    // @brief Get image data from the response body.
    // @return HTMLImageElement instance on success, null on error.
    public GetImage(): HTMLImageElement
    {
        let image = new Image();
        image.src = this.mImageData;
        return image;
    };
};

export class CImageHttpResponseFactory extends CHttpResponseFactory<CImageHttpResponse>
{
    //////////////////////////////////////////////////////////////////////////
    public Create(): CImageHttpResponse
    {
        return new CImageHttpResponse( this.mResponseData );
    };
};

export var GImageHttpResponseFactory = new CImageHttpResponseFactory();
