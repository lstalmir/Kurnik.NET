import { IRenderable, ERenderPass } from "../rendering/renderable";
import { FVertex } from "./vertex";
import { CContext } from "../rendering/context";
import { EUniform, EAttribute } from "../rendering/program";
import { FVector } from "../core/math/vector";
import { GDebug } from "../core/debug";
import { IDisposable } from "../core/disposable";
import { FVector2D } from "../core/math/vector2d";
import { FRotator } from "../core/math/rotator";


export abstract class CObject implements IRenderable, IDisposable
{
    public Name: string;
    public Position: FVector;
    public Rotation: FRotator;
    public TexcoordOffset: FVector2D;

    protected mIndexCount: number;
    protected mVertexBuffer: WebGLBuffer;
    protected mIndexBuffer: WebGLBuffer;
    protected mRenderFlags: number;


    //////////////////////////////////////////////////////////////////////////
    // @brief Construct new object instance.
    // @param context [in] Instance of WebGL context wrapper.
    // @param name [in] Name of the object.
    public constructor( context: CContext, name: string, renderFlags: number = ERenderPass.Geometry )
    {
        var gl = context.GetGLContext();

        this.Name = name;
        this.mRenderFlags = renderFlags;
        this.Position = new FVector();
        this.Rotation = new FRotator();
        this.TexcoordOffset = new FVector2D();
        this.mVertexBuffer = gl.createBuffer();
        this.mIndexBuffer = gl.createBuffer();

        context.GetDebug().Log(
            'Created object ' + this.Name +
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
    // @brief Render the object.
    // @param context [in] Instance of WebGL context wrapper.
    // @param renderPass [in] Type of the current render pass.
    public Render( context: CContext, renderPass: ERenderPass ): void
    {
        if ( renderPass & this.mRenderFlags )
        {
            var gl = context.GetGLContext();
            var program = context.GetProgram();

            gl.bindBuffer( gl.ARRAY_BUFFER, this.mVertexBuffer );
            FVertex.EnableInputLayout( context );

            gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.mIndexBuffer );

            let instancePositionLoc = program.GetAttributeLocation( EAttribute.InstancePosition );
            if ( instancePositionLoc >= 0 )
            {
                gl.vertexAttrib3f(
                    instancePositionLoc,
                    this.Position.x,
                    this.Position.y,
                    this.Position.z );
            }

            let instanceTexcoordLoc = program.GetAttributeLocation( EAttribute.InstanceTexcoord );
            if ( instanceTexcoordLoc >= 0 )
            {
                gl.vertexAttrib2f(
                    program.GetAttributeLocation( EAttribute.InstanceTexcoord ),
                    this.TexcoordOffset.x,
                    this.TexcoordOffset.y );
            }

            gl.drawElements( gl.TRIANGLES, this.mIndexCount, gl.UNSIGNED_SHORT, 0 );

            FVertex.DisableInputLayout( context );
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
