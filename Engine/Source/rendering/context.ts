import { CProgram } from "./program";
import { CDebug, CDebugWebGLRenderingContext } from "../core/debug";

export class CContext
{
    private mGL: WebGLRenderingContext;
    private mCanvas: HTMLCanvasElement;
    private mCurrentProgram: CProgram;
    private mDebug: CDebug;

    //////////////////////////////////////////////////////////////////////////
    public constructor( canvas: HTMLCanvasElement )
    {
        this.mDebug = new CDebug();
        this.mCanvas = canvas;
        this.mGL = canvas.getContext( "webgl" );

        if ( this.mGL == null )
        {
            throw Error( "Failed to initialize WebGL context." );
        }

        this.mDebug.Log( 'WebGL context created' );
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
    public GetDebug(): CDebug
    {
        return this.mDebug;
    };

    //////////////////////////////////////////////////////////////////////////
    public SetProgram( program: CProgram ): void
    {
        this.mCurrentProgram = program;

        if ( this.mCurrentProgram != null )
        { // Set new program
            this.mCurrentProgram.Use( this.mGL );
            this.mDebug.Log( 'Switched to program ' + program.GetName() );
        }
        else
        { // Reset program
            this.mGL.useProgram( null );
            this.mDebug.Log( 'Program reset' );
        }
    };

    //////////////////////////////////////////////////////////////////////////
    public GetProgram(): CProgram
    {
        return this.mCurrentProgram;
    };
};
