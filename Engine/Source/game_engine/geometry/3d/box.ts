import { CObject } from "../../engine/object";
import { CContext } from "../../rendering/context";
import { FVector } from "../../core/math/vector";

export class CBox extends CObject
{
    public constructor(
        context: CContext,
        name: string,
        width: number,
        height: number,
        depth: number,
        renderFlags: number )
    {
        super( context, name, renderFlags );

        this.SetVertexDataRaw(
            context,
            [
                0,      0,      0,      0, 0,
                0,      height, 0,      0, 1,
                width,  height, 0,      1, 1,
                width,  0,      0,      1, 0,

                width,  0,      0,      0, 0,
                width,  height, 0,      0, 1,
                width,  height, depth,  1, 1,
                width,  0,      depth,  1, 0,

                width,  0,      depth,  0, 0,
                width,  height, depth,  0, 1,
                0,      height, depth,  1, 1,
                0,      0,      depth,  1, 0,
                
                0,      0,      depth,  0, 0,
                0,      height, depth,  0, 1,
                0,      height, 0,      1, 1,
                0,      0,      0,      1, 0,

                0,      0,      depth,  0, 0,
                0,      0,      0,      0, 1,
                width,  0,      0,      1, 1,
                width,  0,      depth,  1, 0,
                
                0,      height, 0,      0, 0,
                0,      height, depth,  0, 1,
                width,  height, depth,  1, 1,
                width,  height, 0,      1, 0,
            ] );

        this.SetIndexData(
            context,
            [
                0, 1, 2,
                0, 2, 3,
                4, 5, 6,
                4, 6, 7,
                8, 9, 10,
                8, 10, 11,
                12, 13, 14,
                12, 14, 15,
                16, 17, 18,
                16, 18, 19,
                20, 21, 22,
                20, 22, 23
            ] );
    };
};
