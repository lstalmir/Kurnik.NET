import { CContext } from "../game_engine/rendering/context";
import { ERenderPass } from "../game_engine/rendering/renderable";
import { CRectangle } from "../game_engine/geometry/2d/rectangle";
import { FVector } from "../game_engine/core/math/vector";
import { FRotator } from "../game_engine/core/math/rotator";
import { FBombermanPlayerDesc, FBombermanPlayerInitData } from "../bomberman";
import { CTexture2D } from "../game_engine/engine/texture";
import { ETexture, EUniform } from "../game_engine/rendering/program";
import { FColor } from "../game_engine/core/color";
import { EBombermanTexture, EBombermanUniform } from "./shaders/shader_constants";
import { CBombermanExternalResources } from "./external_resources";
import { FBombermanColor } from "./color";

export class CBombermanPlayer extends CRectangle
{
    public readonly Id: number;
    public readonly Name: string;
    public readonly AvatarSrc: string;
    public readonly Color: FBombermanColor;

    //////////////////////////////////////////////////////////////////////////
    public constructor( context: CContext, desc: FBombermanPlayerDesc, initData?: FBombermanPlayerInitData )
    {
        super( context, desc.Name + "_object", 30, 30, 5, 5, ERenderPass.Geometry );

        this.Id = desc.Id;
        this.Name = desc.Name;
        this.AvatarSrc = desc.AvatarSrc;
        this.Color = FBombermanColor.GetBombermanColor( desc.Color );

        if ( initData != null )
        {
            this.Position.Set( new FVector( initData.X, initData.Y ) );
            this.Rotation.Set( new FRotator( initData.Rotation ) );
        }
    };

    //////////////////////////////////////////////////////////////////////////
    public Render( context: CContext, renderPass: ERenderPass ): void
    {
        if ( renderPass == ERenderPass.Geometry )
        {
            context.SetUniform3f( EUniform.MaterialDiffuseColor,
                this.Color.r, this.Color.g, this.Color.b );
        }
        super.Render( context, renderPass );
    }
};
