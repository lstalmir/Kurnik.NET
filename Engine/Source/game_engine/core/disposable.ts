
export interface IDisposable
{
    //////////////////////////////////////////////////////////////////////////
    // @brief Dispose the instance. Release all resources used by it.
    // @param gl [in] Instance of WebGL rendering context.
    Dispose( gl?: WebGLRenderingContext ): void;
}
