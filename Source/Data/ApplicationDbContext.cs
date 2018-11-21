using System;
using System.Collections.Generic;
using System.Text;
using Kurnik.Areas.Identity.Data;
using Kurnik.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Source.Data
{
    public class ApplicationDbContext : IdentityDbContext<User>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        
            modelBuilder.Entity<UserParticipationInLobby>()
                .HasKey(participation => new { participation.LobbyID, participation.UserID });
            modelBuilder.Entity<UserParticipationInLobby>()
                .HasOne(participation => participation.Lobby)
                .WithMany(lobby => lobby.UserParticipations)
                 .IsRequired();
            modelBuilder.Entity<UserParticipationInLobby>()
                .HasOne(participation => participation.User)
                .WithMany(user => user.LobbyParticipations)
                .IsRequired();

            modelBuilder.Entity<Lobby>().HasData(new Lobby { ID=1 ,Name = "test lobby", Private = false });
            modelBuilder.Entity<Lobby>().HasData(new Lobby { ID=2 ,Name = "test lobby2", Private = false });
            modelBuilder.Entity<Lobby>().HasData(new Lobby { ID=3 ,Name = "private lobby", Private = true });
        }

        public DbSet<Lobby> Lobbies { get; set; }

        public DbSet<UserParticipationInLobby> UserParticipationInLobbies { get; set; }
    }
}
