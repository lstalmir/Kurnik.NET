import { CProgram } from "./program";

export class CContext
{
    private mGL: WebGLRenderingContext;
    private mCanvas: HTMLCanvasElement;
    private mCurrentProgram: CProgram;

    //////////////////////////////////////////////////////////////////////////
    public constructor( canvas: HTMLCanvasElement )
    {
        this.mCanvas = canvas;
        this.mGL = canvas.getContext( "webgl" );

        if ( this.mGL == null )
        {
            throw Error( "Failed to initialize WebGL context." );
        }
    };

    //////////////////////////////////////////////////////////////////////////
    public GetGLContext(): WebGLRenderingContext
    {
        return this.mGL;
    };

    //////////////////////////////////////////////////////////////////////////
    public GetCanvas(): HTMLCanvasElement
    {
        return this.mCanvas;
    };

    //////////////////////////////////////////////////////////////////////////
    public SetProgram( program: CProgram ): void
    {
        this.mCurrentProgram = program;

        if ( this.mCurrentProgram != null )
        { // Set new program
            this.mCurrentProgram.Use();
        }
        else
        { // Reset program
            this.mGL.useProgram( null );
        }
    };

    //////////////////////////////////////////////////////////////////////////
    public GetProgram(): CProgram
    {
        return this.mCurrentProgram;
    };
};
