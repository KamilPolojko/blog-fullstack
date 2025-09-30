docker run --name redis -p 6379:6379 -d redis 


Note: Currently using in-memory session storage. For production deployment with multiple instances, consider migrating to Redis session store for horizontal scaling.