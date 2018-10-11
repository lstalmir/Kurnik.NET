import { CObject } from "../../game/object";
import { CContext } from "../../rendering/context";
import { FVertex } from "../../game/vertex";

export class CRectangle extends CObject
{
    //////////////////////////////////////////////////////////////////////////
    public constructor(
        context: CContext,
        name: string,
        width: number,
        height: number,
        x = 0,
        y = 0 )
    {
        super( context, name );
        
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
