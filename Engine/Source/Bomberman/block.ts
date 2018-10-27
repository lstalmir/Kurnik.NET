import { CContext } from "../game_engine/rendering/context";
import { CObject } from "../game_engine/engine/object";
import { ERenderPass } from "../game_engine/rendering/renderable";

export class CBombermanBlock extends CObject
{
    public readonly Id: number;
    public readonly Name: string;

    //////////////////////////////////////////////////////////////////////////
    public constructor( context: CContext, id: number, name: string )
    {
        super( context, name + "_object", ERenderPass.Geometry );

        this.Id = id;
        this.Name = name;
    };
};
