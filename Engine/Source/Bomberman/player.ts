import { CContext } from "../game_engine/rendering/context";
import { ERenderPass } from "../game_engine/rendering/renderable";
import { CRectangle } from "../game_engine/geometry/2d/rectangle";
import { FVector } from "../game_engine/core/math/vector";
import { FRotator } from "../game_engine/core/math/rotator";
import { FBombermanPlayerDesc, FBombermanPlayerInitData } from "../bomberman";

export class CBombermanPlayer extends CRectangle
{
    public readonly Id: number;
    public readonly Name: string;
    public readonly AvatarSrc: string;

    //////////////////////////////////////////////////////////////////////////
    public constructor( context: CContext, desc: FBombermanPlayerDesc, initData?: FBombermanPlayerInitData )
    {
        super( context, desc.Name + "_object", 30, 30, 0, 0, ERenderPass.Geometry );

        this.Id = desc.Id;
        this.Name = desc.Name;
        this.AvatarSrc = desc.AvatarSrc;

        if ( initData != null )
        {
            this.Position.Set( new FVector( initData.X, initData.Y ) );
            this.Rotation.Set( new FRotator( initData.Rotation ) );
        }
    };
};
