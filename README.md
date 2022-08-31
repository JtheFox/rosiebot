# Rosiebot

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Discord](https://img.shields.io/badge/discord.js-%237289DA.svg?style=for-the-badge&logo=discord&logoColor=white)
![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white)
![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=Sequelize&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)
![Riot Games](https://img.shields.io/badge/riotgames-D32936.svg?style=for-the-badge&logo=riotgames&logoColor=white)

1. [Features](#current-features)
2. [Commands](#commands)
3. [Future Updates](#future-updates)
4. [Resources](#resources)

Rosiebot is a (currently) personal use discord bot hosted on AWS. The bot is primarily focused on the usage of [Discord's application commands](https://discord.com/developers/docs/interactions/application-commands) via in-app slash commands, but supports some chat commands as well. I am currently building out the features and functionality and plan to release a public invite when I get to a point in development that I'm satisfied with.

## Commands
See [the docs](https://jthefox.github.io/rosiebot/) for full list of commands

## Current Features
- Slash commands
- Bot management operations CLI
- Persistent data
  - Per-guild user profiles
  - Betting with per-guild score data
- Documentation site
- API for bot statistics

## Future Updates
**Commands**:
- Ability to set the bet close timer in slash command options
- Duel command between 2 users
- Rock, paper, scissors between 2 users

## Resources
* **Documentation**: [Live Site](https://jthefox.github.io/rosiebot/)
* **Hosting**: [AWS Elastic Beanstalk](https://aws.amazon.com/elasticbeanstalk/)
* **Deployment**: Automated with [AWS CodePipeline](https://aws.amazon.com/codepipeline/)
* **Database**: [AWS RDS](https://aws.amazon.com/rds/)