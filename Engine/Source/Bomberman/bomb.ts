import { CContext } from "../game_engine/rendering/context";
import { CObject } from "../game_engine/engine/object";
import { ERenderPass } from "../game_engine/rendering/renderable";
import { FVertex } from "../game_engine/engine/vertex";
import { EAttribute } from "../game_engine/rendering/program";
import { CAnimatedTexture2D } from "../game_engine/engine/animated_texture";

export class CBombermanBomb extends CObject
{
    public readonly Id: number;
    public readonly Name: string;

    protected mInvoked: boolean;
    protected mInvocationTimestamp: number;

    //////////////////////////////////////////////////////////////////////////
    public constructor( context: CContext, id: number, name: string )
    {
        super( context, name + "_object", ERenderPass.Geometry );

        this.Id = id;
        this.Name = name;
        this.mInvoked = false;
        this.mInvocationTimestamp = 0;
    };

    //////////////////////////////////////////////////////////////////////////
    public Invoke(): void
    {
        this.mInvoked = true;
        this.mInvocationTimestamp = Date.now();
    };

    //////////////////////////////////////////////////////////////////////////
    public IsInvoked(): boolean
    {
        return this.mInvoked;
    };

    //////////////////////////////////////////////////////////////////////////
    // @brief Render the object.
    // @param context [in] Instance of WebGL context wrapper.
    // @param renderPass [in] Type of the current render pass.
    public Render( context: CContext, renderPass: ERenderPass ): void
    {
        if ( !this.IsInvoked() )
        { // Not invoked, render as usual object.
            super.Render( context, renderPass );
        }
        else
        { // Bomb is invoked, render next frame of the animation.
            if ( renderPass & this.mRenderFlags )
            {
                var gl = context.GetGLContext();
                var program = context.GetProgram();

                // Update animation frame
                let material = context.GetMaterial();
                if ( material.DiffuseTexture != null &&
                    material.DiffuseTexture instanceof CAnimatedTexture2D )
                {
                    this.TexcoordOffset.Set( material.DiffuseTexture.GetFrameTexcoord(
                        Date.now() - this.mInvocationTimestamp ) );
                }
                
                FVertex.EnableInputLayout( context, this.mVertexBuffer );

                gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.mIndexBuffer );

                gl.vertexAttrib3f(
                    program.GetAttributeLocation( EAttribute.InstancePosition ),
                    this.Position.x,
                    this.Position.y,
                    this.Position.z );

                gl.vertexAttrib2f(
                    program.GetAttributeLocation( EAttribute.InstanceTexcoord ),
                    this.TexcoordOffset.x,
                    this.TexcoordOffset.y );

                gl.drawElements( gl.TRIANGLES, this.mIndexCount, gl.UNSIGNED_SHORT, 0 );

                FVertex.DisableInputLayout( context );
            }
        }
    };
};
