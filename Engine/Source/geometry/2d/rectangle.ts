import { CObject } from "../../engine/object";
import { CContext } from "../../rendering/context";
import { ERenderPass } from "../../rendering/renderable";

export class CRectangle extends CObject
{
    //////////////////////////////////////////////////////////////////////////
    public constructor(
        context: CContext,
        name: string,
        width: number,
        height: number,
        x: number = 0,
        y: number = 0,
        renderFlags: number = ERenderPass.Geometry )
    {
        super( context, name, renderFlags );
        
        this.SetVertexDataRaw(
            context,
            [
                x, y, 0, 0, 0,
                x, y + height, 0, 0, 1,
                x + width, y + height, 0, 1, 1,
                x + width, y, 0, 1, 0
            ] );
        
        this.SetIndexData(
            context,
            [
                0, 1, 2,
                0, 2, 3
            ] );
    };
};
