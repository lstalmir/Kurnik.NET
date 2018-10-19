import { CProgram } from "./program";
import { CDebug, CDebugWebGLRenderingContext } from "../core/debug";

export class CContext
{
    private mGL: WebGLRenderingContext;
    private mGL2: WebGL2RenderingContext;
    private mUseWebGL2: boolean;
    private mCanvas: HTMLCanvasElement;
    private mCurrentProgram: CProgram;
    private mDebug: CDebug;

    //////////////////////////////////////////////////////////////////////////
    public constructor( canvas: HTMLCanvasElement )
    {
        this.mDebug = new CDebug();
        this.mCanvas = canvas;

        this.mGL2 = canvas.getContext( "webgl2" );
        this.mGL = this.mGL2 as WebGLRenderingContext;
        this.mUseWebGL2 = true;
        
        if ( this.mGL2 == null )
        { // The browser does not support WebGL2.
            this.mGL = canvas.getContext( "webgl" );
            this.mUseWebGL2 = false;
        }

        if ( this.mGL == null && this.mGL2 == null )
        {
            throw Error( "Failed to initialize WebGL context." );
        }

        if ( this.mGL2 )
        {
            this.mDebug.Log( "Using webgl2 rendering context" );
        }
    };

    //////////////////////////////////////////////////////////////////////////
    public GetGLContext(): WebGLRenderingContext
    {
        return this.mGL;
    };

    //////////////////////////////////////////////////////////////////////////
    public GetGL2Context(): WebGL2RenderingContext
    {
        return this.mGL2;
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
