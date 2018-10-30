import { CProgram, EUniform } from "./program";
import { CDebug, CDebugWebGLRenderingContext } from "../core/debug";
import { CMaterial } from "../engine/material";

export class CContext
{
    private mGL: WebGLRenderingContext;
    private mGL2: WebGL2RenderingContext;
    private mUseWebGL2: boolean;
    private mCanvas: HTMLCanvasElement;
    private mCurrentProgram: CProgram;
    private mCurrentMaterial: CMaterial;
    private mDebug: CDebug;

    //////////////////////////////////////////////////////////////////////////
    public constructor( canvas: HTMLCanvasElement, createDebug: boolean = false )
    {
        this.mDebug = new CDebug();
        this.mCanvas = canvas;

        //this.mGL2 = canvas.getContext( "webgl2" );
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

        if ( createDebug )
        {
            this.mGL = new CDebugWebGLRenderingContext( this.mGL );
            this.mDebug.Log( "Using rendering context debug layer" );
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
        this.mCurrentMaterial = null;
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

    //////////////////////////////////////////////////////////////////////////
    public GetMaterial(): CMaterial
    {
        return this.mCurrentMaterial;
    };

    //////////////////////////////////////////////////////////////////////////
    public SetMaterial( material: CMaterial ): void
    {
        this.mCurrentMaterial = material;

        this.mGL.uniform3f(
            this.mCurrentProgram.GetUniformLocation( EUniform.MaterialDiffuseColor ),
            material.DiffuseColor.r,
            material.DiffuseColor.g,
            material.DiffuseColor.b );

        this.mGL.uniform1f(
            this.mCurrentProgram.GetUniformLocation( EUniform.MaterialSpecularValue ),
            material.SpecularValue );

        this.mGL.uniform1f(
            this.mCurrentProgram.GetUniformLocation( EUniform.MaterialSpecularExponent ),
            material.SpecularExponent );

        this.mGL.uniform1f(
            this.mCurrentProgram.GetUniformLocation( EUniform.MaterialTransparency ),
            material.Transparency );

        if ( material.DiffuseTexture != null )
        {
            material.DiffuseTexture.Bind(
                this.mGL,
                this.mCurrentProgram.GetUniformLocation( EUniform.MaterialDiffuseTexture ),
                0 );
            this.mGL.uniform1i(
                this.mCurrentProgram.GetUniformLocation( EUniform.UseDiffuseTexture ),
                1 );
        }
        else
        {
            this.mGL.uniform1i(
                this.mCurrentProgram.GetUniformLocation( EUniform.UseDiffuseTexture ),
                0 );
        }

        if ( material.SpecularTexture != null )
        {
            material.SpecularTexture.Bind(
                this.mGL,
                this.mCurrentProgram.GetUniformLocation( EUniform.MaterialSpecularTexture ),
                1 );
            this.mGL.uniform1i(
                this.mCurrentProgram.GetUniformLocation( EUniform.UseSpecularTexture ),
                1 );
        }
        else
        {
            this.mGL.uniform1i(
                this.mCurrentProgram.GetUniformLocation( EUniform.UseSpecularTexture ),
                0 );
        }

        if ( material.NormalTexture != null )
        {
            material.NormalTexture.Bind(
                this.mGL,
                this.mCurrentProgram.GetUniformLocation( EUniform.MaterialNormalTexture ),
                2 );
            this.mGL.uniform1i(
                this.mCurrentProgram.GetUniformLocation( EUniform.UseNormalTexture ),
                1 );
        }
        else
        {
            this.mGL.uniform1i(
                this.mCurrentProgram.GetUniformLocation( EUniform.UseNormalTexture ),
                0 );
        }

        if ( material.AlphaTexture != null )
        {
            material.AlphaTexture.Bind(
                this.mGL,
                this.mCurrentProgram.GetUniformLocation( EUniform.MaterialAlphaTexture ),
                3 );
            this.mGL.uniform1i(
                this.mCurrentProgram.GetUniformLocation( EUniform.UseAlphaTexture ),
                1 );
        }
        else
        {
            this.mGL.uniform1i(
                this.mCurrentProgram.GetUniformLocation( EUniform.UseAlphaTexture ),
                0 );
        }
    };
};
