﻿import { CBombermanApplication, FBombermanApplicationDesc } from "./Bomberman/application";

export enum EBombermanStatus
{
    OK,
    Error = -1,
    AlreadyExists = -2,
    NotFound = -3,
    InvalidArgument = -4,
    NotImplemented = -5
};

export interface IBombermanApplication
{
    //////////////////////////////////////////////////////////////////////////
    /// \function
    ///     Run
    ///
    /// \brief
    ///     Start application's render loop.
    ///
    ///     After calling this function, the application will start rendering
    ///     frames with specified frame rate. To change the frame rate, see
    ///     SetTargetRefreshRate function.
    ///
    /// \return
    ///     Result of the operation.
    ///     - EBombermanStatus.OK - application successfully started.
    ///     - EBombermanStatus.Error - function failed.
    //////////////////////////////////////////////////////////////////////////
    Run(): EBombermanStatus;

    //////////////////////////////////////////////////////////////////////////
    /// \function
    ///     AddBlock
    //////////////////////////////////////////////////////////////////////////
    AddBlock(
        id  : number,
        x   : number,
        y   : number
    ): EBombermanStatus;

    //////////////////////////////////////////////////////////////////////////
    /// \function
    ///     RemoveBlock
    //////////////////////////////////////////////////////////////////////////
    RemoveBlock(
        id  : number
    ): EBombermanStatus;

    //////////////////////////////////////////////////////////////////////////
    /// \function 
    ///     AddPlayer
    ///
    /// \brief 
    ///     Add new player to the application.
    ///
    ///     The application identifies each player by the unique number. 
    ///     Thus, the provided ID cannot be associated with two players at 
    ///     the same time in the same application. If such case happens, 
    ///     AlreadyExists error is returned and the state of the application
    ///     remains unchanged.
    ///
    /// \param id [in] 
    ///     Unique identifier to associate the new player with.
    ///
    /// \param name [in] 
    ///     Friendly name of the player.
    ///
    /// \param x [in] 
    ///     Location of the new player (x component, horizontal).
    ///
    /// \param y [in] 
    ///     Location of the new player (y component, vertical).
    ///
    /// \param rotation [in] 
    ///     Rotation angle of the new player (in radians).
    ///     The application assumes 0 as no rotation, when player is facing
    ///     north (top). All rotations are clock-wise.
    ///
    /// \return 
    ///     Result of the operation.
    ///     - EBombermanStatus.OK - Player successfully added to the 
    ///         application.
    ///     - EBombermanStatus.Error - Unspecified internal error prevented
    ///         the application from adding new player.
    ///     - EBombermanStatus.AlreadyExists - Player with the given 
    ///         identifier is already registered in the current application
    ///         instance.
    //////////////////////////////////////////////////////////////////////////
    AddPlayer(
        id          : number,
        name        : string,
        x           : number,
        y           : number,
        rotation    : number
    ): EBombermanStatus;

    //////////////////////////////////////////////////////////////////////////
    /// \function
    ///     RemovePlayer
    ///
    /// \brief
    ///     Remove player from the application.
    ///
    /// \param id [in]
    ///     Unique player identifier. Each player has its own ID associated
    ///     with. If the caller provides invalid identifier, the function
    ///     fails with NotFound error code.
    ///
    /// \return
    ///     Result of the operation.
    ///     - EBombermanStatus.OK - Player successfully removed from the
    ///         application.
    ///     - EBombermanStatus.Error - Unspecified internal error prevented
    ///         the application from removing new player.
    ///     - EBombermanStatus.NotFound - Player with specified identifier
    ///         was not found in the current application instance.
    //////////////////////////////////////////////////////////////////////////
    RemovePlayer(
        id  : number
    ): EBombermanStatus;

    //////////////////////////////////////////////////////////////////////////
    /// \function
    ///     SetPlayerTransform
    //////////////////////////////////////////////////////////////////////////
    SetPlayerTransform(
        id          : number,
        x           : number,
        y           : number,
        rotation    : number
    ): EBombermanStatus;

    //////////////////////////////////////////////////////////////////////////
    /// \function
    ///     AddBomb
    //////////////////////////////////////////////////////////////////////////
    AddBomb(
        id  : number,
        x   : number,
        y   : number
    ): EBombermanStatus;

    //////////////////////////////////////////////////////////////////////////
    /// \function
    ///     RemoveBomb
    //////////////////////////////////////////////////////////////////////////
    RemoveBomb(
        id  : number
    ): EBombermanStatus;

    //////////////////////////////////////////////////////////////////////////
    /// \function
    ///     InvokeBomb
    //////////////////////////////////////////////////////////////////////////
    InvokeBomb(
        id  : number
    ): EBombermanStatus;

    //////////////////////////////////////////////////////////////////////////
    /// \function
    ///     SetTargetRefreshRate
    ///
    /// \brief
    ///     Set upper cap for the number of rendered frames per second.
    ///
    ///     Setting higher target causes the game to be rendered more 
    ///     smoothly, but increases CPU and GPU usage. Setting it lower may
    ///     reduce the usage, but the game will run less smoothly.
    ///
    /// \param fps [in]
    ///     New frames per second target. Setting it to -1 will disable the
    ///     cap and the game will render as many frames as possible. Only
    ///     finite integer values are accepted.
    ///
    /// \return
    ///     Result of the operation.
    ///     - EBombermanStatus.OK - New FPS target successfully set.
    ///     - EBombermanStatus.Error - Internal application error prevented
    ///         the operation from finishing.
    ///     - EBombermanStatus.InvalidArgument - Specified FPS cap was not
    ///         valid, for example it was equal to 0, or was negative value
    ///         (except -1, see description of fps parameter).
    //////////////////////////////////////////////////////////////////////////
    SetTargetRefreshRate(
        fps : number
    ): EBombermanStatus;
};

//////////////////////////////////////////////////////////////////////////////
/// \function
///     CreateBombermanApplication
///
/// \brief
///     Create new bomberman application instance.
///
///     The application will start after the call to Run() function and will
///     render on the canvas element identified by the provided element ID.
///
/// \param canvasId [in]
///     HTML Canvas element id for the target canvas. If the specified canvas
///     is not found, the function returns null.
///
/// \param width [in]
///     Number of intersections in each row.
///
/// \param height [in]
///     Number of intersections in each column.
///
/// \return
///     Valid IBombmermanApplication instance on success, null of failure.
//////////////////////////////////////////////////////////////////////////////
export function CreateBombermanApplication(
    canvasId: string,
    width: number,
    height: number
): IBombermanApplication
{
    try
    {
        let appDesc = new FBombermanApplicationDesc;
        appDesc.CanvasID = canvasId;
        appDesc.Width = width;
        appDesc.Height = height;

        return new CBombermanApplication( appDesc );
    }
    catch ( e ) { }
    return null;
};
