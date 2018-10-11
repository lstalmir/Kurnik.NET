import { CObject } from "../game/object";

export interface IGeometryFactory
{
    //////////////////////////////////////////////////////////////////////////
    // @brief Generate vertex and index data for the geometry.
    Create(): CObject;
};
