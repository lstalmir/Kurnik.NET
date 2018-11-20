import { CContext } from "./context";

export enum ERenderPass
{
    Geometry = 1,
    Lighting = 2,
    PostProcessing = 4,
    UserInterface = 8
};

export interface IRenderable
{
    //////////////////////////////////////////////////////////////////////////
    // @brief Render object implementing this interface.
    // @param context [in] Instance of WebGL context wrapper.
    // @param renderPass [in] Type of the current render pass.
    Render( context: CContext, renderPass: ERenderPass ): void;
};
