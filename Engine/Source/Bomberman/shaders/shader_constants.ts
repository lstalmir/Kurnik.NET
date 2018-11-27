import { EUniform, ETexture } from "../../game_engine/rendering/program";

export enum EBombermanUniform
{
    BlurPixelOffset = EUniform.USER_DEFINED,
    InvWorldSize,
    PostProcessPass,
    PlayerPass,
    FlipTexcoordHorizontal
};

export enum EBombermanTexture
{
    MaterialColorMask = ETexture.USER_DEFINED
};
