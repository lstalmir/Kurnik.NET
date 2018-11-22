using Kurnik.Areas.Identity.Data;
using Kurnik.Models;
using Kurnik.Services;
using Microsoft.EntityFrameworkCore;
using Source.Data;
using System;
using System.Collections.Generic;
using Xunit;

namespace Kurnik.Tests
{
    public class LobbyService_EditLobbyShould
    {
        [Fact]
        public void ThrowExceptionGivenIdOutOfRange()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: "SetPrivateShould_ThrowExceptionGivenIdOutOfRange")
                .Options;

            using (var context = new ApplicationDbContext(options))
            {
                var service = new LobbyService(context);
                Assert.Throws<ArgumentOutOfRangeException>(() => service.EditLobby(5, "SomeLobby", true));
            }
        }

        [Fact]
        public void UpdateDatabaseGivenExistingId()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: "SetPrivateShould_UpdateDatabaseGivenExistingId")
                .Options;

            var id = 0;
            using (var context = new ApplicationDbContext(options))
            {
                id = context.Lobbies.Add(new Lobby
                {
                    Name = "Test",
                    Private = false
                }).Entity.ID;
                context.SaveChanges();
            }
            using (var context = new ApplicationDbContext(options))
            {
                var service = new LobbyService(context);
                service.EditLobby(id, "GoodName", true);
            }

            using (var context = new ApplicationDbContext(options))
            {
                Assert.True(context.Lobbies.Find(id).Private);
                Assert.Equal("GoodName", context.Lobbies.Find(id).Name);
            }
        }
    }

    public class LobbyService_AddUserShould
    {
        [Fact]
        public void ThrowExceptionGivenLobbyIdOutOfRange()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: "AddUserShould_ThrowExceptionGivenLobbyIdOutOfRange")
                .Options;

            using (var context = new ApplicationDbContext(options))
            {
                context.Users.Add(new User()
                {
                    Id = "test_user"
                });
                context.SaveChanges();
            }

            using (var context = new ApplicationDbContext(options))
            {
                var service = new LobbyService(context);
                Assert.Throws<ArgumentOutOfRangeException>(() => service.AddUser(5, "test_user"));
            }
        }

        [Fact]
        public void ThrowExceptionGivenUserIdOutOfRange()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: "AddUserShould_ThrowExceptionGivenUserIdOutOfRange")
                .Options;

            var lobbyId = 0;
            using (var context = new ApplicationDbContext(options))
            {
                lobbyId = context.Lobbies.Add(new Lobby()).Entity.ID;
                context.SaveChanges();
            }

            using (var context = new ApplicationDbContext(options))
            {
                var service = new LobbyService(context);
                Assert.Throws<ArgumentOutOfRangeException>(() => service.AddUser(lobbyId, "unknown_user"));
            }
        }

        [Fact]
        public void ThrowExceptionWhenUserIsAlreadyInTheLobby()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: "AddUserShould_ThrowExceptionWhenUserIsAlreadyInTheLobby")
                .Options;

            var lobbyId = 0;
            using (var context = new ApplicationDbContext(options))
            {
                var lobby = context.Lobbies.Add(new Lobby()).Entity;
                lobbyId = lobby.ID;
                var user = context.Users.Add(new User()
                {
                    Id = "test_user"
                }).Entity;
                var participation = context.UserParticipationInLobbies.Add(new UserParticipationInLobby()
                {
                    UserID = "test_user",
                    LobbyID = lobbyId
                }).Entity;
                user.LobbyParticipations.Add(participation);
                lobby.UserParticipations.Add(participation);
                context.SaveChanges();
            }

            using (var context = new ApplicationDbContext(options))
            {
                var service = new LobbyService(context);
                Assert.Throws<InvalidOperationException>(() => service.AddUser(lobbyId, "test_user"));
            }
        }

        [Fact]
        public void SuccessWhenUserIsNotInTheLobby()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: "AddUserShould_SuccessWhenUserIsNotInTheLobby")
                .Options;

            var lobbyId = 0;
            using (var context = new ApplicationDbContext(options))
            {
                lobbyId = context.Lobbies.Add(new Lobby()).Entity.ID;
                context.Users.Add(new User()
                {
                    Id = "test_user"
                });
                context.SaveChanges();
            }

            using (var context = new ApplicationDbContext(options))
            {
                var service = new LobbyService(context);
                service.AddUser(lobbyId, "test_user");
            }

            using (var context = new ApplicationDbContext(options))
            {
                var participation = context.UserParticipationInLobbies.Find(new object[] { lobbyId, "test_user" });
                Assert.NotNull(participation);
                Assert.True(context.Lobbies.Find(lobbyId).UserParticipations.Contains(participation));
                Assert.True(context.Users.Find("test_user").LobbyParticipations.Contains(participation));
            }
        }

        public class LobbyService_RemoveUserShould
        {
            [Fact]
            public void DoNothingWhenUserIsNotInTheLobby()
            {
                var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: "RemoveUserShould_DoNothingWhenUserIsNotInTheLobby")
                .Options;

                var lobbyId = 0;
                using (var context = new ApplicationDbContext(options))
                {
                    lobbyId = context.Lobbies.Add(new Lobby()).Entity.ID;
                    context.Users.Add(new User()
                    {
                        Id = "test_user"
                    });
                    context.SaveChanges();
                }

                using (var context = new ApplicationDbContext(options))
                {
                    var service = new LobbyService(context);
                    service.RemoveUser(lobbyId, "test_user");
                }
            }

            [Fact]
            public void SuccessWhenUserIsInTheLobby()
            {
                var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: "RemoveUserShould_SuccessWhenUserIsInTheLobby")
                .Options;

                var lobbyId = 0;
                using (var context = new ApplicationDbContext(options))
                {
                    var lobby = context.Lobbies.Add(new Lobby()).Entity;
                    lobbyId = lobby.ID;
                    var user = context.Users.Add(new User()
                    {
                        Id = "test_user"
                    }).Entity;
                    var participation = context.UserParticipationInLobbies.Add(new UserParticipationInLobby()
                    {
                        UserID = "test_user",
                        LobbyID = lobbyId
                    }).Entity;
                    user.LobbyParticipations.Add(participation);
                    lobby.UserParticipations.Add(participation);
                    context.SaveChanges();
                }

                using (var context = new ApplicationDbContext(options))
                {
                    var service = new LobbyService(context);
                    service.RemoveUser(lobbyId, "test_user");
                }

                using (var context = new ApplicationDbContext(options))
                {
                    Assert.Null(context.UserParticipationInLobbies.Find(new object[] { lobbyId, "test_user" }));
                    Assert.Null(context.Lobbies.Find(lobbyId).UserParticipations);
                    Assert.Null(context.Users.Find("test_user").LobbyParticipations);
                }
            }
        }
        public class LobbyService_CreateLobbyShould
        {
            [Fact]
            public void SuccedWhenGivenUniqueName()
            {
                var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: "CreateLobbyShould_SuccedWhenGivenUniqueName")
                .Options;

                Lobby lobby;
                var userId = "test_user";
                var lobbyName = "new_lobby";
                var isPrivate = true;
                using (var context = new ApplicationDbContext(options))
                {
                    context.Users.Add(new User()
                    {
                        Id = userId
                    });
                    context.SaveChanges();
                }
                using (var context = new ApplicationDbContext(options))
                {
                    var service = new LobbyService(context);
                    lobby = service.CreateLobby(userId, lobbyName, isPrivate);
                }
                using (var context = new ApplicationDbContext(options))
                {
                    Assert.NotNull(lobby);
                    Assert.Equal(lobby.Name, lobbyName);
                    Assert.Equal(lobby.OwnerID, userId);
                    Assert.Equal(lobby.Private, isPrivate);
                }
            }
            [Fact]
            public void ThrowInvalidOperationExceptionWhenLobbyWithThisNameExists()
            {
                var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: "CreateLobbyShould_ThrowInvalidOperationExceptionWhenLobbyWithThisNameExists")
                .Options;
                using (var context = new ApplicationDbContext(options))
                {
                    var lobby = context.Lobbies.Add(new Lobby() { Name = "new_lobby" }).Entity;
                    context.Users.Add(new User()
                    {
                        Id = "test_user"
                    });
                    context.SaveChanges();
                }

                using (var context = new ApplicationDbContext(options))
                {
                    var service = new LobbyService(context);
                    Assert.Throws<InvalidOperationException>(() => service.CreateLobby("test_user", "new_lobby", true));
                }
            }
        }
    }
    public class LobbyService_GetAllPublicOrOnwedLobbiesShould
    {
        [Fact]
        public void ReturnCorrectLobbiesList()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: "GetAllPublicOrOnwedLobbiesShould_ReturnCorrectLobbiesList")
            .Options;

            var userId = "test_user";
            Lobby publicLobby1;
            Lobby publicLobby2;
            Lobby privateLobby;
            IList<Lobby> lobbyList;
            using (var context = new ApplicationDbContext(options))
            {
                publicLobby1 = context.Lobbies.Add(new Lobby() { Name = "public_lobby1", OwnerID = userId, Private = false }).Entity;
                publicLobby2 = context.Lobbies.Add(new Lobby() { Name = "public_lobby2", OwnerID = userId, Private = false }).Entity;
                privateLobby = context.Lobbies.Add(new Lobby() { Name = "private_lobby", OwnerID = userId, Private = true }).Entity;
                context.SaveChanges();
            }
            using (var context = new ApplicationDbContext(options))
            {
                var service = new LobbyService(context);
                lobbyList = service.GetAllPublicOrOwnedLobbies(userId);
            }
            using (var context = new ApplicationDbContext(options))
            {
                Assert.True(lobbyList.Contains(publicLobby1));
                Assert.True(lobbyList.Contains(publicLobby2));
                Assert.True(lobbyList.Contains(privateLobby));

            }
        }
    }
    public class LobbyService_RemoveLobby
    {
        [Fact]
        public void SucceddWhenLobbyExists()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: "RemoveLobby_SucceddWhenLobbyExists")
            .Options;

            int lobbyId;
            string userId = "test_user";
            using (var context = new ApplicationDbContext(options))
            {
                lobbyId = context.Lobbies.Add(new Lobby() { Name = "new_lobby", OwnerID = userId }).Entity.ID;
                context.Users.Add(new User()
                {
                    Id = userId
                });
                context.SaveChanges();
            }
            using (var context = new ApplicationDbContext(options))
            {
                var service = new LobbyService(context);
                service.RemoveLobby(lobbyId, userId);
            }
        }
        [Fact]
        public void ShouldThrowArgumentOutOfRangeExceptionWhenLobbyDoesNotExists()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: "RemoveLobby_ShouldThrowArgumentOutOfRangeExceptionWhenLobbyDoesNotExists")
            .Options;

            string userId = "test_user";
            using (var context = new ApplicationDbContext(options))
            {
                context.Users.Add(new User()
                {
                    Id = userId
                });
                context.SaveChanges();
            }
            using (var context = new ApplicationDbContext(options))
            {
                var service = new LobbyService(context);
                Assert.Throws<ArgumentOutOfRangeException>(() => service.RemoveLobby(1, userId));
            }
        }
        [Fact]
        public void ShouldThrowInvalidOperationExceptionWhenUserIsNotOwnerOfTheLobby()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: "RemoveLobby_ShouldThrowInvalidOperationExceptionWhenUserIsNotOwnerOfTheLobby")
            .Options;

            int lobbyId;
            string userId = "test_user";
            using (var context = new ApplicationDbContext(options))
            {
                lobbyId = context.Lobbies.Add(new Lobby() { Name = "new_lobby", OwnerID = userId }).Entity.ID;
                context.Users.Add(new User()
                {
                    Id = userId
                });
                context.SaveChanges();
            }
            using (var context = new ApplicationDbContext(options))
            {
                var service = new LobbyService(context);
                Assert.Throws<InvalidOperationException>(() => service.RemoveLobby(lobbyId, "not_onwer_id"));
            }
        }
    }
}
