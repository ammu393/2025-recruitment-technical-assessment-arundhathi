# DevSoc Subcommittee Recruitment: Platforms
Your task is to send a direct message to the matrix handle `@chino:oxn.sh` using the Matrix protocol. However, this message must be sent over a self hosted instance such as through the Conduwuit implementation or the slightly more complicated Synapse implementation.

For this to work your server must be federated, but you do not have to worry about specifics such as using your domain name as your handle (a subdomain will do!) or have other 'nice to have' features. Just a message will do!

**You should write about what you tried and your process in the answer box below.**

If you don't manage to get this working we'll still want to hear about what you tried, what worked and what didn't work, etc. Good luck!

---

> ANSWER BOX
```

Although I was extremely confused in the beginning, a little bit of research helped me understand and make my way through with this question. I initially looked into what Conduit was and found out it is a matrix server, which is essentially what allows for real time communication across a range of different servers. Initially I tried to install Conduit manually, but with a bit of research and time consuming errors and hurdles, I found out that you can use docker to automate everything, as docker already includes this template, hence making it easier for us. So, instead of installing dependencies manually, all I had to do was to install docker and use it for Conduit. Another challenge I faced was that I was not really familiar with docker, however this is a framework I wanted to learn for a long time, so I enjoyed researching into it. One error I kept bumping into was that no containers were running, hence I couldn't register an account and send the message. This took a while for me to understand, but eventually I narrowed it down to the missing toml file that had to be used. After fixing this and researching what needs to be included in the file, I was eventually able to send the direct message to the @chino:oxn.sh` using curl -X command. 

```