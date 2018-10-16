import { IRenderable, ERenderPass } from "../rendering/renderable";
import { FVertex } from "./vertex";
import { CContext } from "../rendering/context";
import { EAttribute, EUniform } from "../rendering/program";
import { FVector } from "../core/math/vector";
import { FQuaternion } from "../core/math/quaternion";
import { FMatrix } from "../core/math/matrix";
import { GDebug } from "../core/debug";
import { IDisposable } from "../core/disposable";


export abstract class CObject implements IRenderable, IDisposable
{
    protected mName: string;
    protected mIndexCount: number;
    protected mVertexBuffer: WebGLBuffer;
    protected mIndexBuffer: WebGLBuffer;
    protected mPosition: FVector;
    protected mRotation: FQuaternion;
    protected mModelMatrix: FMatrix;
    protected mRenderFlags: number;


    //////////////////////////////////////////////////////////////////////////
    // @brief Construct new object instance.
    // @param context [in] Instance of WebGL context wrapper.
    // @param name [in] Name of the object.
    public constructor( context: CContext, name: string, renderFlags: number = ERenderPass.Geometry )
    {
        var gl = context.GetGLContext();

        this.mName = name;
        this.mRenderFlags = renderFlags;
        this.mPosition = new FVector();
        this.mRotation = new FQuaternion();
        this.mModelMatrix = new FMatrix();
        this.mVertexBuffer = gl.createBuffer();
        this.mIndexBuffer = gl.createBuffer();

        context.GetDebug().Log(
            'Created object ' + this.mName +
            ' with render flags (' + this.mRenderFlags + ')' );
    };

    //////////////////////////////////////////////////////////////////////////
    // @brief Release resources used by the object instance.
    // @param gl [in] Instance of WebGL rendering context.
    public Dispose( gl: WebGLRenderingContext ): void
    {
        gl.deleteBuffer( this.mVertexBuffer );
        gl.deleteBuffer( this.mIndexBuffer );
    };

    //////////////////////////////////////////////////////////////////////////
    // @brief Set object position.
    // @param position [in] New object position.
    public SetPosition( position: FVector ): void
    {
        // Avoid creating internal dependencies on local references.
        this.mPosition = new FVector( position.x, position.y, position.z );
        this.RecalculateModelMatrix();
    };

    //////////////////////////////////////////////////////////////////////////
    // @brief Set object rotation.
    // @param position [in] New object rotation.
    public SetRotation( rotation: FQuaternion ): void
    {
        // Avoid creating internal dependencies on local references.
        this.mRotation = new FQuaternion( rotation.x, rotation.y, rotation.z, rotation.w );
        this.RecalculateModelMatrix();
    };

    //////////////////////////////////////////////////////////////////////////
    // @brief Render the world.
    // @param context [in] Instance of WebGL context wrapper.
    public Render( context: CContext, renderPass: ERenderPass ): void
    {
        if ( renderPass & this.mRenderFlags )
        {
            var gl = context.GetGLContext();
            var program = context.GetProgram();

            gl.bindBuffer( gl.ARRAY_BUFFER, this.mVertexBuffer );
            gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.mIndexBuffer );

            // Set model matrix for vertex shader
            program.SetUniform( gl, EUniform.ModelMatrix, this.mModelMatrix.M );

            // Must be called after buffer binding
            FVertex.EnableInputLayout( context );

            gl.drawElements( gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0 );

            FVertex.DisableInputLayout( context );

            if ( GDebug )
            {
                context.GetDebug().Log( this.mName + ' drawn' );

                // DEBUG: Cleanup buffers, remove in release
                gl.bindBuffer( gl.ARRAY_BUFFER, null );
                gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, null );
            }
        }
    };

    //////////////////////////////////////////////////////////////////////////
    // @brief Set internal vertex buffer data.
    // @param context [in] Instance of WebGL context wrapper.
    // @param vertices [in] Data to be passed to the vertex buffer.
    protected SetVertexData( context: CContext, vertices: FVertex[] )
    {
        // Extract raw data from vertices and call SetVertexDataRaw
        let rawVertices = new Array<number>();
        for ( let vertex of vertices )
        {
            rawVertices = rawVertices.concat( vertex.GetData() );
        }
        this.SetVertexDataRaw( context, rawVertices );
    };

    //////////////////////////////////////////////////////////////////////////
    // @brief Set internal vertex buffer data.
    // @param context [in] Instance of WebGL context wrapper.
    // @param vertices [in] Data to be passed to the vertex buffer.
    protected SetVertexDataRaw( context: CContext, vertices: number[] )
    {
        var gl = context.GetGLContext();

        gl.bindBuffer( gl.ARRAY_BUFFER, this.mVertexBuffer );
        gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( vertices ), gl.STATIC_DRAW );
        gl.bindBuffer( gl.ARRAY_BUFFER, null );
    };

    //////////////////////////////////////////////////////////////////////////
    // @brief Set internal index buffer data.
    // @param context [in] Instance of WebGL context wrapper.
    // @param indices [in] Data to be passed to the index buffer.
    protected SetIndexData( context: CContext, indices: number[] )
    {
        var gl = context.GetGLContext();

        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.mIndexBuffer );
        gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array( indices ), gl.STATIC_DRAW );
        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, null );

        this.mIndexCount = indices.length;
    };

    //////////////////////////////////////////////////////////////////////////
    // @brief Calculate new model matrix from current position and rotation
    //  values.
    protected RecalculateModelMatrix(): void
    {
        alert( "CObject.RecalculateModelMatrix: not implemented" );
    };
};
