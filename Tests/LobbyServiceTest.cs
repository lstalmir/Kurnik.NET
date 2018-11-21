using Kurnik.Areas.Identity.Data;
using Kurnik.Models;
using Kurnik.Services;
using Microsoft.EntityFrameworkCore;
using Source.Data;
using System;
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

            using (var context= new ApplicationDbContext(options))
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
                var user = context.Users.Add(new User() {
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

                using(var context = new ApplicationDbContext(options))
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
                    Assert.Null(context.UserParticipationInLobbies.Find(new object[] { lobbyId, "test_user"}));
                    Assert.Null(context.Lobbies.Find(lobbyId).UserParticipations);
                    Assert.Null(context.Users.Find("test_user").LobbyParticipations);
                }
            }
        }
    }
}
