import { CProgram, EUniform, ETexture } from "./program";
import { CDebug, CDebugWebGLRenderingContext } from "../core/debug";
import { CMaterial } from "../engine/material";
import { CTexture } from "../engine/texture";
import { NotSupportedException, InvalidArgumentException } from "../core/error";
import { CRenderTarget } from "./render_target";
import { FColor } from "../core/color";
import { FViewport } from "./renderer";

export class CContext
{
    private mGL: WebGLRenderingContext;
    private mGL2: WebGL2RenderingContext;
    private mUseWebGL2: boolean;
    private mCanvas: HTMLCanvasElement;
    private mCurrentProgram: CProgram;
    private mCurrentMaterial: CMaterial;
    private mCurrentViewport: FViewport;
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
    public SetTexture( slot: number, texture: CTexture ): void
    {
        this.mGL.activeTexture( this.mGL.TEXTURE0 + slot );

        switch ( texture.Dimension )
        {
            case 1:
                this.mGL.bindTexture( this.mGL.TEXTURE, texture.GetView() );
                break;

            case 2:
                this.mGL.bindTexture( this.mGL.TEXTURE_2D, texture.GetView() );
                break;

            case 3:
                if ( this.mGL2)
                {
                    this.mGL2.bindTexture( this.mGL2.TEXTURE_3D, texture.GetView() );
                    break;
                }
                throw new NotSupportedException( 'WebGL2.0 is required to support 3D textures' );
        }

        this.mGL.uniform1i( this.mCurrentProgram.GetTextureLocation( slot ), slot );
    };

    //////////////////////////////////////////////////////////////////////////
    public SetRenderTargets( count: number, targets: CRenderTarget[] ): void
    {
        if ( count < 1 )
        {
            throw new InvalidArgumentException( 'At least one render target must be specified' );
        }

        if ( this.mGL2 )
        {
            for ( let i = 0; i < count; ++i )
            {
                if ( targets[i] )
                    this.mGL2.bindFramebuffer( i, targets[i].GetRenderTargetView() );
                else
                    this.mGL2.bindFramebuffer( i, null );
            }
        }
        else
        {
            if ( count != 1 )
            {
                throw new NotSupportedException( 'WebGL2.0 is required to support multiple render targets' );
            }
            if ( targets[0] )
                this.mGL.bindFramebuffer( this.mGL.FRAMEBUFFER, targets[0].GetRenderTargetView() );
            else
                this.mGL.bindFramebuffer( this.mGL.FRAMEBUFFER, null );
        }
    };

    //////////////////////////////////////////////////////////////////////////
    public ClearRenderTarget( color: FColor ): void
    {
        this.mGL.clearColor( color.r, color.g, color.b, color.a );
        this.mGL.clear( this.mGL.COLOR_BUFFER_BIT );
    };

    //////////////////////////////////////////////////////////////////////////
    public ClearDepth(): void
    {
        this.mGL.clearDepth( this.mCurrentViewport.DepthMax );
        this.mGL.clear( this.mGL.DEPTH_BUFFER_BIT );
    };

    //////////////////////////////////////////////////////////////////////////
    public SetViewport( viewport: FViewport ): void
    {
        this.mGL.viewport(
            viewport.X,
            viewport.Y,
            viewport.Width,
            viewport.Height );

        this.mCurrentViewport = viewport;
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
                this.mCurrentProgram.GetTextureLocation( ETexture.MaterialDiffuse ),
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
                this.mCurrentProgram.GetTextureLocation( ETexture.MaterialSpecular ),
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
                this.mCurrentProgram.GetTextureLocation( ETexture.MaterialNormal ),
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
                this.mCurrentProgram.GetTextureLocation( ETexture.MaterialAlpha ),
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
