import { CProgram, EUniform, ETexture } from "./program";
import { CDebug, CDebugWebGLRenderingContext, GDebug } from "../core/debug";
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
    public constructor( canvas: HTMLCanvasElement, createDebug: boolean = false, useWebGL2: boolean = false )
    {
        this.mDebug = new CDebug( createDebug );
        this.mCanvas = canvas;

        if ( useWebGL2 )
        {
            this.mGL2 = canvas.getContext( "webgl2" );
            this.mGL = this.mGL2 as WebGLRenderingContext;
            this.mUseWebGL2 = true;
        }

        if ( this.mGL2 == null )
        { // The browser does not support WebGL2.
            this.mGL = canvas.getContext( "webgl" );
            this.mUseWebGL2 = false;
        }

        if ( this.mGL == null && this.mGL2 == null )
        {
            throw Error( "Failed to initialize WebGL context." );
        }

        if ( createDebug )
        {
            this.mGL = new CDebugWebGLRenderingContext( this.mGL );
            this.mDebug.Log( "Using rendering context debug layer" );

            if ( this.mGL2 )
            {
                this.mDebug.Log( "Using webgl2 rendering context" );
            }
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
    public SetTexture( slot: number, texture: WebGLTexture, dimension: number = 2 ): void
    {
        this.mGL.activeTexture( this.mGL.TEXTURE0 + slot );

        switch ( dimension )
        {
            case 1:
                this.mGL.bindTexture( this.mGL.TEXTURE, texture );
                break;

            case 2:
                this.mGL.bindTexture( this.mGL.TEXTURE_2D, texture );
                break;

            case 3:
                if ( this.mGL2)
                {
                    this.mGL2.bindTexture( this.mGL2.TEXTURE_3D, texture );
                    break;
                }
                throw new NotSupportedException( 'WebGL2.0 is required to support 3D textures' );

            default:
                throw new InvalidArgumentException( 'Invalid texture dimenstion' );
        }

        this.mGL.uniform1i( this.mCurrentProgram.GetTextureLocation( slot ), slot );
    };

    //////////////////////////////////////////////////////////////////////////
    public SetUniform1i( uniform: number, x: number ): void
    {
        this.mGL.uniform1i( this.mCurrentProgram.GetUniformLocation( uniform ), x );
    };

    public SetUniform1iv( uniform: number, data: number[] ): void
    {
        this.mGL.uniform1iv( this.mCurrentProgram.GetUniformLocation( uniform ), data );
    };

    public SetUniform1f( uniform: number, x: number ): void
    {
        this.mGL.uniform1f( this.mCurrentProgram.GetUniformLocation( uniform ), x );
    };

    public SetUniform1fv( uniform: number, data: number[] ): void
    {
        this.mGL.uniform1fv( this.mCurrentProgram.GetUniformLocation( uniform ), data );
    };

    public SetUniform2i( uniform: number, x: number, y: number ): void
    {
        this.mGL.uniform2i( this.mCurrentProgram.GetUniformLocation( uniform ), x, y );
    };

    public SetUniform2iv( uniform: number, data: number[] ): void
    {
        this.mGL.uniform2iv( this.mCurrentProgram.GetUniformLocation( uniform ), data );
    };

    public SetUniform2f( uniform: number, x: number, y: number ): void
    {
        this.mGL.uniform2f( this.mCurrentProgram.GetUniformLocation( uniform ), x, y );
    };

    public SetUniform2fv( uniform: number, data: number[] ): void
    {
        this.mGL.uniform2fv( this.mCurrentProgram.GetUniformLocation( uniform ), data );
    };

    public SetUniform3i( uniform: number, x: number, y: number, z: number ): void
    {
        this.mGL.uniform3i( this.mCurrentProgram.GetUniformLocation( uniform ), x, y, z );
    };

    public SetUniform3iv( uniform: number, data: number[] ): void
    {
        this.mGL.uniform3iv( this.mCurrentProgram.GetUniformLocation( uniform ), data );
    };

    public SetUniform3f( uniform: number, x: number, y: number, z: number ): void
    {
        this.mGL.uniform3f( this.mCurrentProgram.GetUniformLocation( uniform ), x, y, z );
    };

    public SetUniform3fv( uniform: number, data: number[] ): void
    {
        this.mGL.uniform3fv( this.mCurrentProgram.GetUniformLocation( uniform ), data );
    };
    
    public SetUniform4i( uniform: number, x: number, y: number, z: number, w: number ): void
    {
        this.mGL.uniform4i( this.mCurrentProgram.GetUniformLocation( uniform ), x, y, z, w );
    };

    public SetUniform4iv( uniform: number, data: number[] ): void
    {
        this.mGL.uniform4iv( this.mCurrentProgram.GetUniformLocation( uniform ), data );
    };

    public SetUniform4f( uniform: number, x: number, y: number, z: number, w: number ): void
    {
        this.mGL.uniform4f( this.mCurrentProgram.GetUniformLocation( uniform ), x, y, z, w );
    };

    public SetUniform4fv( uniform: number, data: number[] ): void
    {
        this.mGL.uniform4fv( this.mCurrentProgram.GetUniformLocation( uniform ), data );
    };

    public SetUniformMatrix2fv( uniform: number, transpose: boolean, data: number[] )
    {
        this.mGL.uniformMatrix2fv( this.mCurrentProgram.GetUniformLocation( uniform ), transpose, data );
    };

    public SetUniformMatrix3fv( uniform: number, transpose: boolean, data: number[] )
    {
        this.mGL.uniformMatrix3fv( this.mCurrentProgram.GetUniformLocation( uniform ), transpose, data );
    };

    public SetUniformMatrix4fv( uniform: number, transpose: boolean, data: number[] )
    {
        this.mGL.uniformMatrix4fv( this.mCurrentProgram.GetUniformLocation( uniform ), transpose, data );
    };

    //////////////////////////////////////////////////////////////////////////
    public SetRenderTargets( count: number, targets: CRenderTarget[] ): void
    {
        if ( count < 1 )
        {
            throw new InvalidArgumentException( 'At least one render target must be specified' );
        }
        if ( count != 1 )
        {
            throw new NotSupportedException( 'WebGL does not support multiple render targets' );
        }
        if ( targets[0] )
            this.mGL.bindFramebuffer( this.mGL.FRAMEBUFFER, targets[0].GetRenderTargetView() );
        else
            this.mGL.bindFramebuffer( this.mGL.FRAMEBUFFER, null );
    };

    //////////////////////////////////////////////////////////////////////////
    public ClearRenderTarget( color: FColor ): void
    {
        this.mGL.clearColor( color.r, color.g, color.b, color.a );
        this.mGL.clear( this.mGL.COLOR_BUFFER_BIT );
    };

    //////////////////////////////////////////////////////////////////////////
    public ClearDepth( depth: number ): void
    {
        this.mGL.clearDepth( depth );
        this.mGL.clear( this.mGL.DEPTH_BUFFER_BIT );
    };

    //////////////////////////////////////////////////////////////////////////
    public Clear( color: FColor, depth: number ): void
    {
        this.mGL.clearColor( color.r, color.g, color.b, color.a );
        this.mGL.clearDepth( depth );
        this.mGL.clear( this.mGL.COLOR_BUFFER_BIT | this.mGL.DEPTH_BUFFER_BIT );
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
            this.SetTexture( ETexture.MaterialDiffuse, material.DiffuseTexture.GetView() );
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
            this.SetTexture( ETexture.MaterialSpecular, material.SpecularTexture.GetView() );
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
            this.SetTexture( ETexture.MaterialNormal, material.NormalTexture.GetView() );
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
            this.SetTexture( ETexture.MaterialAlpha, material.AlphaTexture.GetView() );
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
