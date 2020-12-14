## Task 0: Docker CLI
### Following are some important docker commands 

- To check available images 
	> docker image ls

- To check running containers
	> docker container ls

- To check all (running + stopped) containers)
	> docker container ls -a

- To pull an image from Registry (e.g. Docker Hub)
	> docker pull <image_name>

- To create a new container (in stopped state)
	> docker create <image_name> 

- To create a container in running state
	> docker run <image_name> 

- Some important flags to pass while creating a container

	 - --name <name>   
	 - -p <external_port>:<internal_port>   
	 - -d (detached or in background mode)  
	 - --rm (Remove the container as soon as it is stopped)  
	 - -v source:destination (for volume mounting)  
	 - -it (withinteractive shell)  
	 - Example
	   > docker run --rm --name mywebserver -d -p 8081:80 nginx:latest

- To stop a running container
	> docker stop <container_name or id>

- To start a stopped container 
	> docker start <container_name or id>

- To remove a running container
	> docker container rm -f <container_name or id>

- Execute a command in a running container (-it means interactive terminal)
	> docker exec -it mywebserver bash

- Remove docker image (forcefully)
	> docker rmi -f <image_name> 

## Task 1: Download an Image & Play with it

- Pull an image and store in docker cache
	> docker pull nginx:latest

- Run container in detatched mode (-d) with a name and forward 8081 to 80 
	> docker run --name mywebserver -d -p 8081:80 nginx:latest

- Test in browser => http://localhost:8081/
OR 
- By using Curl
	> curl http://localhost:8081

- Stop container & verify
	> docker container stop mywebserver 
	
	> docker container ls
	
	> docker container ls -a

- Start the stopped container  
	> docker start mywebserver

- Stop & remove a container 
	> docker stop mywebserver
	
	> docker container rm -f mywebserver

- Now Create a container (in stopped state)
	> docker create --name mywebserver -d -p 8081:80 nginx:latest
	
	> docker container ls

	> docker container ls -a

- Now Start the stopped conatiner 
	> docker start mywebserver 
	
	> docker container ls

- Test in browser => http://localhost:8081/

- Stop & remove a container 
	> docker container rm -f mywebserver

- Run multiple nginx containers but on different ports
	> docker create --name mywebserver1 -d -p 8081:80 nginx:latest
	
	> docker create --name mywebserver2 -d -p 8082:80 nginx:latest

	> docker create --name mywebserver3 -d -p 8083:80 nginx:latest

- Check in browser 
	- http://localhost:8081
	- http://localhost:8082
	- http://localhost:8083

- Clean the resources
	> docker container rm -f mywebserver1
	
	> docker container rm -f mywebserver2
	
	> docker container rm -f mywebserver3


## Task 2: Docker writeable layer is temporary

**Note:** niginx:latest is configured to use /usr/share/nginx/html as default directory. We are going to add a new page & check if webserver serves that.

- Start nginx container 
	> docker run --name mywebserver -d -p 8081:80 nginx:latest

- Connvect with mywebserver container 
	> docker exec -it mywebserver bash

- Go to /usr/share/nginx/html and see its content
	> cd /usr/share/nginx/html
	
	> ls

- Create a file (use Ctr +D to get out from cat)

	    cat > a.html
	    <h1>Hello</h1>

- Check in browser => http://localhost:8081/a.html

	> Ctr+P & Ctr +Q to get out from container

- Remove & run container again & check if a.html is still there
	> docker container rm -f mywebserver
	
	> docker run --name mywebserver -d -p 8081:80 nginx:latest
	
	> docker exec -it mywebserver bash
	
	> cd /usr/share/nginx/html && ls 

**Result:** We'll not have file there as when container is removed, its writeable layer is also removed

- Get out from container (Ctr+PQ)

- Clean the resources
	> docker container rm -f mywebserver

## Task 3: Understanding Volume Mounting in Dockers

https://docs.docker.com/storage/
- Docker provides different option to store things outside of container 
	- volumes
	- bind mount 
	- tmpfs mount
	- named pipes 
- :ro (read only)
- :rw (read write)

### Option 1: (using volumes or Docker File System)
Note: We'll not give full path of 'Source' in this case but just a name.

- Start container & create a file & check in browser. Docker will create a myapp folder in Host file system but in docker defined area. 
	> docker run --name mywebserver -d -p 8081:80 -v myapp:/usr/share/nginx/html nginx:latest

	> docker exec -it mywebserver bash

	> cd /usr/share/nginx/html && ls 

	> Create a file with content (Use Ctr + D to end cat)

	    cat > a.html
	    <h1>Hello</h1>

- Check in browser => http://localhost:8081/a.html
- Remove container, create again & check if file is still there? 
	> docker container rm -f mywebserver
	
	> docker run --name mywebserver -d -p 8081:80 -v myapp:/usr/share/nginx/html nginx:latest
	
	> docker exec -it mywebserver bash
	
	> cd /usr/share/nginx/html && ls 

**Result:** File is still there as it is was not part of container but coming fom host machine. 

    Question: Where is myapp folder on host machine?
    On Windows: \\wsl$\docker-desktop-data\version-pack-data\community\docker\volumes
    On Linux: /var/bin/docker

- Clean the resources
	> docker container rm -f mywebserver

### Option 2: (using bind mount)
Note: We'll give full path of 'Source' in this case.

**Assumption:** Full path of nginx1 folder is => D:\dockerseries\nginx1 (/d/dockerseries/nginx1)

- Open nginx1 folder in VSCode 
- Create index.html file with following content

	    <h1>Hello World - Pakistan</h1>

- Start container & check in browser 
	> docker run --name mywebserver -d -p 8081:80 -v /d/dockerseries/nginx1:/usr/share/nginx/html nginx:latest

- Check /usr/share/nginx/html in container. 
	> docker exec -it mywebserver bash
	
	> cd /usr/share/nginx/html && ls 

**Result:** We should see our index.html file in /usr/share/nginx/html (although we created that outside of container)

- Check in browser => http://localhost:8081/

**Result:** We should see our page now instead of nginx default page

- Now create a file in container & check if we find that file at mounted path (i.e. /d/dockerseries/nginx1)

	    cat > a.html
	    <h1>Hello</h1>

	> Ctr +D to end cat 

- Check if we've a.html file in /d/dockerseries/nginx1

**Result:** We should have a.html available in source directory. 

- Also check in browser => http://localhost:8081/a.html
- Remove container, create again & check if file is still visible in /usr/share/nginx/html? 
	> docker container rm -f mywebserver
	
	> docker run --name mywebserver -d -p 8081:80 -v /d/dockerseries/nginx1:/usr/share/nginx/html nginx:latest
	
	> docker exec -it mywebserver bash
	
	> cd /usr/share/nginx/html && ls 

- Clean the resources
	> docker container rm -f mywebserver

## Task 4: Create your own nginx image with content inside it 

Assumption: Full path of nginx2 => D:\dockerseries\nginx2 (/d/dockerseries/nginx2)

- Open nginx2 folder in VSCode and create a file 'Dockerfile'with following content 

	    FROM nginx:latest
	    COPY . /usr/share/nginx/html  # copies current folder content to /usr/share/nginx/html

- Open new terminal in VSCode. Build image using Dockerfile. Name of file is bilalshahzad/mytest and context is current directory
	> docker build -t bilalshahzad139/mytest .

- Check if newly created image is available in cache
	> docker image ls 

- Run container of this new image 
	> docker run --name mywebserver -p 8081:80 -d bilalshahzad139/mytest

- Check http://localhost:8081 in browser 
- Stop & Remove container 
	> docker rm -f mywebserver 

- Make change in index.html file & build image again 
	> docker build -t bilalshahzad139/mytest .

- Run container of updated image by using same command 
	> docker run --name mywebserver -p 8081:80 -d bilalshahzad139/mytest

- Check http://localhost:8081 in browser 
- Connect to container & check html folder 
	> docker exec -it mywebserver bash

	> cd /usr/share/nginx/html && ls 

		  Ctr+PQ to get out from container without stopping container 

- Clean the resources
	> docker container rm -f mywebserver 

## Task 5: Create an image and push to Docker Hub 

**Assumptions:** 
- Account is created on https://hub.docker.com/ and repository is mytest (e.g. bilalshahzad139/mytest)
- Full path of nginx2 => D:\dockerseries\nginx2 (/d/dockerseries/nginx2)

- Open nginx2 folder in VSCode. Create image (if it not created yet). We already have a Dockerfile.
	> docker build -t bilalshahzad139/mytest .

- Login to docker registry (i.e.https://hub.docker.com/)
	> docker login --username=bilalshahzad139

- Push image 
	> docker push bilalshahzad139/mytest

- Verify if image is pushed successfully on => https://hub.docker.com/bilalshahzad139/mytest

- Now remove image from local cache & pull it from docker hub 
	> docker rmi bilalshahzad139/mytest
	
	> docker pull bilalshahzad139/mytest   

- Run container
	> docker run --name mywebserver -p 8081:80 -d bilalshahzad139/mytest

- Check http://localhost:8081 in browser 
- Clean the resources
	> docker container rm -f mywebserver 

## Task 6: Save & Load Image from a file

### Save bilalshahzad139/mytest image to test.tar file

- On Linux
	> docker save bilalshahzad139/mytest > test.tar

- On Windows
	> docker save bilalshahzad139/mytest -o test.tar

- Remove from cache 
	> docker rmi bilalshahzad139/mytest

###  Load image from mytest.tar file
- On Linux 
	> docker load --input test.tar

- On Windows
	> docker load -i test.tar

- Run container
	> docker run --name mywebserver -p 8081:80 -d bilalshahzad139/mytest

- Check http://localhost:8081 in browser 
- Clean the resources
	> docker container rm -f mywebserver 

**Note:** unzip .tar file and explore its content & find the layer we created.

Learning: 

- An Image is a combination of Layers (stacked on one another)
- A layer is a file system overriding files on layers below it

## Task 7: Playing with a node application without docker

**Prerequisite:** Node is installed on machine 

- Open 'node1' folder in VS Code and open a new terminal in VSCode
- Check node & npm versions 
	> node --version 
	
	> npm --version 

- Install packages 
	> npm install 

- Run application
	> node server.js 

- Check http://localhost:8080 in browser

	    Ctr + C (in terminal) to stop server 


## Task 8: Using NodeJS in Container for development

**Assumption:** Full path of node2 => D:\dockerseries\node2 (/d/dockerseries/node2)

- Open 'node2' folder in VS Code and open a new terminal
- Start Node container  (-it => interactive terminal )
	> docker run -it --name mynode node:12

Problem: It will start with node as entry point.

- Remove container
	> docker container rm -f mynode 

- Start Node container with bash as terminal
	> docker run -it --name mynode node:12 bash 

- Check node & npm versions 
	> node --version
	> npm --version 

- Check a folder (already available)
	> cd /usr/src && ls 

Note: Now we can create our node files here and work like we can do on our machine but that is not good approach.

    Ctr + PQ Get out of terminal without ending container 

- Remove container 
	> docker container rm -f mynode 

- Now run container with a volume mounted & port forwarding. Our application is going to run on a port (e.g. 8080) internally.
	> docker run -it --name mynode -v /d/dockerseries/node2:/usr/src -p 8080:8080 node:12 bash

- Go to /usr/src folder & check content 
	> cd /usr/src && ls 

Note: We should see our node app files here. 

Let's do our development as we were doing earlier 

	> npm install 

	> node server.js 

- Test http://localhost:8080 in browser 

- In VSCode, make a change in server.js. For example

	    Hello World to Hello World Again 

- Exit node server by using Ctr + C & start again
	> node server.js

- Test http://localhost:8080 in browser 
- Exit node server by using Ctr + C, 
- Get out of container Ctr + PQ
- Clean the resources
	> docker container rm -f mynode 

## Task 9: Package nodejs app in a docker image

Assumption: full path of node3 => D:\dockerseries\node3 (/d/dockerseries/node3)

What should we do to containerized this app?
- An image with Node & npm
- Copy Node code
- Install packages using npm 
- Expose 8080 port
- node server.js as starting command of container 


### Let's do
- Open 'node3' folder in VS Code and create a file 'Dockerfile' with following content  

	    FROM node:12
	    WORKDIR /usr/src/app
	    COPY . .
	    RUN npm install
	    EXPOSE 8080
	    CMD [ "node", "server.js" ]

- Create a file '.dockerignore' with following content (to ignore node_modules folder while copying content during image build)

	    node_modules
	    Dockerfile

- Create image 
	> docker build -t bilalshahzad139/nodetest . 

- Run docker container 
	> docker run --name mynodeserver -p 8080:8080 -d  bilalshahzad139/nodetest

- Check http://localhost:8080 in browser 

- Check logs of container 
	> docker logs mynodeserver

- Connect to container with 'bash' shell
	> docker exec -it mynodeserver bash

- Check content of /usr/src/app
	> cd /usr/src/app && ls

- Get out from container 
	> exit 

- Clean the resources
	> docker rm -f mynodeserver 

## Task 10: Install MySQL & connect from workbench

https://hub.docker.com/_/mysql

Assumption: We've an empty folder /d/dockerseries/mysqldata

- Run MySQL Container (don't forget to expose port) with a password for root user
	> docker run --name mytestsql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=123 -d mysql:latest

- Try to connect through some MySql client (e.g. workbench) (localhost, root, 123)
- Remvoe container 
	> docker rm -f mytestsql 

- Run MySQL Container with mount folder 
	> docker run --name mytestsql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=123 -d -v /d/dockerseries/mysqldata:/var/lib/mysql mysql:latest

- Try to connect through workbench (localhost, root, 123) and create following objects
- Create a new schema 'mytestdb' 

	    create schema mytestdb;

- Cretae a new table in 'mytestdb'

	    create table mytable (id int, name varchar(50));

- Add some dummy rows 

	    insert into mytable select 1,'bilal';
	    insert into mytable select 2,'shahzad';

- Remvoe container 
	> docker rm -f mytestsql 

- Run MySQL container again with same mounted folder 
	> docker run --name mytestsql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=123 -d -v /d/dockerseries/mysqldata:/var/lib/mysql mysql:latest

- Connect through workbench (localhost, root, 123) and verify if schema & table with data is still there.

- Clean the resources
	> docker rm -f mytestsql 

## Task 11: Connect NodeJS app with containered MySQL

- Run MySQL Container with mount folder 
	> docker run --name mytestsql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=123 -d -v /d/dockerseries/mysqldata:/var/lib/mysql mysql:latest

- Try to connect through workbench (localhost, root, 123)  and check if schema, table & data is there 
- Open node4 folder in VSCode and open a new terminal there
- Now Run Node App to test connection with above MySql instance with "localhost" 

	    node server.js 

- Test http://localhost:8080 in browser 

	    Press Ctr + C to exit server

- Remvoe mysql container 
	> docker rm -f mytestsql 

## Task 12: Connect containered NodeJS app with containered Mysql DB 

 - Run MySQL Container with mount folder 
	   > docker run --name mytestsql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=123 -d -v /d/dockerseries/mysqldata:/var/lib/mysql mysql:latest
   
- Try to connect through workbench (localhost, root, 123)  and check if
   schema, table & data is there
- Now we need to run NodeJS app through container by mapping source code or by building an image with our code 
- We can run nodejs container mapped with our src folder OR We can build a new image without our nodeJS  But first if we'll try to connect MySQL from container (using localhost), it will not be able to find MySQL in container as "localhost" means container itself. so we need to find IPAddress of MySQL container 
- Find IPAddress of a container by inspectecting MySQL container & find "IPAddress" value (e.g. 172.17.0.2)
  > docker inspect mytestsql 

### Option 1: Using nodeJs container mapped with our source folder 

Assumption: Full path of node5 => D:\dockerseries\node5 (/d/dockerseries/node5)

- Open node5 folder in VSCode & update server.js => "host" property to IPAddress found through inspect of mysql container. 
- Open new terminal in VSCode and run NodeJS container with a volume mounted 
  > docker run -it --name mysqlnodetest -v /d/dockerseries/node5:/usr/src -p 8080:8080 node:12 bash

- Go to /usr/src folder & check content. Note: We should see our node app files here. 
  > cd /usr/src && ls 
 
- Let's do our development as we were doing earlier 
- Run following commands in container-terminal
  > npm install 
  
  > node server.js 

- Test in browser  => http://localhost:8080
- Make a change in server.js (in VSCode)

      Hello World => Hello World Again 
- Exit node server (Ctr + C ) & start again (in terminal)
  > node server.js

- Test in browser  => http://localhost:8080
- Exit node server (Ctr + C ) & come out of container (Ctr + PQ
- Clean Resources
  > docker container rm -f mysqlnodetest

###  Option 2: Build new image with NodeJS & our src 

Assumption: Full path of node6 => D:\dockerseries\node6 (/d/dockerseries/node6)

- Open node6 folder in VSCode and update server.js => "host" property to IPAddress found through inspect of mysql container. 
- Create a file '.dockerignore' with following content 

	    node_modules
	    Dockerfile

- Create a file 'Dockerfile' with following content 

	    FROM node:12
	    WORKDIR /usr/src/app
	    COPY . .
	    RUN npm install
	    EXPOSE 8080
	    CMD [ "node", "server.js" ]

- Open terminal in VScode and build image 
	> docker build -t bilalshahzad139/mysqlnodetest . 

- Run nodeapp container 
	> docker run --name mysqlnodetest -p 8080:8080 -d  bilalshahzad139/mysqlnodetest

- Test in browser  => http://localhost:8080

- Check logs of mysqlnodetest container
	> docker logs mysqlnodetest

- Only last n lines of log 
	> docker logs mysqlnodetest --tail 10

- Clean Resources
	> docker rm -f mytestsql
	 
	> docker container rm -f mysqlnodetest

Note: If you face issue while connecting nodeJs to mysql, Please try executing following in MySQL to use native password support.

    ALTER USER 'root' IDENTIFIED WITH mysql_native_password BY '123'

## Task 13: Run multiple containers with user defined network (instead of default)

Ref: https://docs.docker.com/network/bridge/
Assumption: Full path of node7 => D:\dockerseries\node7 (/d/dockerseries/node7)

Note: If we don't provide a network, containers are connected to a default 'bridge' network. Containers connected to the same user-defined bridge network effectively expose all ports to each other and can access each other by the container name.

- Create user-defined bridge network (Note: default network type is bridge)
	> docker network create mytestnet 

- Run MySQL Container with user defined network
	> docker run --network mytestnet --name mytestsql_net -p 3306:3306 -e MYSQL_ROOT_PASSWORD=123 -d -v /d/dockerseries/mysqldata:/var/lib/mysql mysql:latest

--- With user-defined bridge network, we can use container 'hostname' or alias e.g. mytestsql_net

- Open folder 'node7' in VSCode and update server.js. Use 'mytestsql_net' in host, 
- Open terminal in VSCode & build an image
	> docker build -t bilalshahzad139/mysqlnodetest_net .

- Run container
	> docker run --network mytestnet --name mysqlnodetest_net -p 8080:8080 -d  bilalshahzad139/mysqlnodetest_net

- Test in browser  => http://localhost:8080

- Check log of mysqlnodetest_net container 
	> docker logs mysqlnodetest_net 

- Remove containers 
	> docker rm -f mytestsql_net
	
	> docker rm -f mysqlnodetest_net

Now Run MySQL without exposing port using -p (as MySQL will be used by node app internally)

- Run MySQL (without -p) & node container
	> docker run --network mytestnet --name mytestsql_net -e MYSQL_ROOT_PASSWORD=123 -d -v /d/dockerseries/mysqldata:/var/lib/mysql mysql:latest
	
	> docker run --network mytestnet --name mysqlnodetest_net -p 8080:8080 -d  bilalshahzad139/mysqlnodetest_net

- Test in browser  => http://localhost:8080
- Check log of mysqlnodetest_net container 
	> docker logs mysqlnodetest_net 

- Check networks 
	> docker network ls 
	
	> docker inspect mytestnet 

- Clean Resources
	> docker rm -f mytestsql_net
	
	> docker rm -f mysqlnodetest_net
	
	> docker network rm mytestnet

## Task 14: Use docker-compose to start multiple services

- Docker Compose is a tool for defining and running multi-container Docker applications. 
- We use a YAML file to configure our application’s services. 

Assumption: 
- Full path of node8 => D:\dockerseries\node8 (/d/dockerseries/node8)
- Assumption: We've following images available used earlier 
	- mysql:latest
	- mysqlnodetest_net (this is using host = mytestsql_net )

### Let's do
- Open node8 folder in VSCode and create a new file 'docker-compose.yml' file with following content in it 

	    version: "3.8"
	    services:
	      db:
	        image: mysql:latest
	        container_name: mytestsql_net
	        ports:
	        - "3306:3306"
	        volumes:
	          - /d/dockerseries/mysqldata:/var/lib/mysql
	        networks:
	          - mytestnet
	        environment:
	          - MYSQL_ROOT_PASSWORD:123
	      web:
	        image: bilalshahzad139/mysqlnodetest_net
	        container_name: mysqlnodetest_net
	        ports:
	          - "8080:8080"
	        networks:
	          - mytestnet
	        depends_on:
	          - db  
	    networks:
	      mytestnet:

	- We are creating db & web services and providing same parameters which we used earlier. 
	- 'db' & 'web' are just names of our services in yml file for referencing purposes.
	- It will create a user-defined-bridge network with a unique name by using 'mytestnet' as postfix.
- Open terminal in VSCode and run following command to start services (-d will start in detached mode)
	> docker-compose up -d 

- Test in browser  => http://localhost:8080

- Check log of node app container 
	> docker logs mysqlnodetest_net

- To stop & remove containers 
	> docker-compose down 

Other commands : 
> docker-compose up (create & start containers, volumes etc)

> docker-compose down (stop & remove containers)

> docker-compose stop (stop containers)

> docker-compose start (start stopped containers)

> docker-compose rm (remove stopped containers)

> docker-compose top (display main running processes from containers )

## Task 15: Run PHP-Apache container for development

Assumption: Full path of php1 => D:\dockerseries\php1 (/d/dockerseries/php1)

- Run PHP-apache container 
	> docker run --name myphp -p 8082:80 -d php:7.4-apache

- Test in browser  => http://localhost:8082
- Remove container
	> docker rm -f myphp

Let's mount our folder & use that with Apache-PHP
- Open php1 folder in VS Code and create a new file 'index.php' with following content 

	    <h1>Hello World! </h1>

- Run PHP-Apache container with a mount point of our folder with Apache main HTML folder 
	> docker run --name myphp -p 8082:80 -v /d/dockerseries/php1:/var/www/html -d php:7.4-apache

- Test in browser  => http://localhost:8082
- Make some changes in index.php
- Test in browser  => http://localhost:8082
- Remove container
	> docker rm -f myphp

## Task 16: Setup PHp/Apache/MySQL Dev Env using docker-compose 

Assumption: Full path of php2 => D:\dockerseries\php2 (/d/dockerseries/php2)

- Open php2 folder in VSCode and update index.php with following code to connect to DB & show data

	    <h1>Hello World! </h1>
	    
	    <?php
	    
	    $mysqli = new mysqli("mytestsql_net", "root", "123", "mytestdb");
	    
	    $sql = "SELECT * FROM mytable";
	    
	    if ($result = $mysqli->query($sql)) {
	        while($row = mysqli_fetch_assoc($result)) {
	    			
	            $id = $row["id"];
	            $name = $row["name"];
	            echo "ID: $id, Name:$name <br>";
	        }
	    }
	    ?>

- Create docker-compose.yml with following content 

	    version: "3.8"
	    services:
	      db:
	        image: mysql:latest
	        container_name: mytestsql_net
	        ports:
	        - "3306:3306"
	        volumes:
	          - /d/dockerseries/mysqldata:/var/lib/mysql
	        networks:
	          - mytestnet
	        environment:
	          - MYSQL_ROOT_PASSWORD:123
	      web:
	        image: php:7.4-apache
	        container_name: myphp
	        ports:
	          - "8082:80"
	        volumes:
	          - /d/dockerseries/php2:/var/www/html
	        networks:
	          - mytestnet
	        depends_on:
	          - db  
	    networks:
	      mytestnet:

- Open terminal in VSCode and run services by docker compose
	> docker-compose up -d 

- Test in browser  => http://localhost:8082
- We'll see following error because php:7.4-apache doesn't have mysqli plugin installed 

	    Fatal error: Uncaught Error: Class 'mysqli' not found in /var/www/html/index.php:5 Stack trace: #0 {main} thrown in /var/www/html/index.php on line 5

- Stop & remove services
	>docker-compose down

Now what should we do?
- We should create our own image (with additional packages) by using php:7.4-apache as base image 
- Create a new file 'Dockerfile' with following content.

	    FROM php:7.4-apache
	    RUN docker-php-ext-install mysqli

- Create docker image 'myphpapache' by running following command in VSCode terminal
	> docker build -t bilalshahzad139/myphpapache .

- Update web => image name in docker-compose file 

	    image: php:7.4-apache => image: bilalshahzad139/myphpapache

 - Run services by docker compose
	>	docker-compose up -d 

- Test in browser  => http://localhost:8082

- Clean Services
	> docker-compose down


## Task 17 - Understanding of dotnet cli

.NET core allows us to build & deploy applicaitons on Linux. .NET core comes with a CLI utility 'dotnet' to do different tasks. We should have basic understanding of it before using docker with .net core applications. We don't full Visual Studio for this but only relevant SDK. To run an application, we only need relevant runtime.

- For example, to create a new console application, we may use following command
	> dotnet new console -f 4.8

- To Restore Nuget packages
	> dotnet restore 
	
- To build solution or a project
	> dotnet build 

- To prepare published content
	> dotnet publish 

- To run an application
	> dotnet <proj.dll>

## Task 18: Create an image using sdk:5.0 as base image + WORKDIR

Note: sdk5.0 is for .NET 5.0

- We need relevant base image
- SDK vs. Runtime 
- We need SDK to compile the code but to run the code we only need runtime
- So use SDK (for temporary purposes) to compile the code and build image with runtime 

Assumption: Full path of dotnet1 => D:\dockerseries\dotnet1 (/d/dockerseries/dotnet1)

- Open dotnet1 folder in VSCode and create a new file 'Dockerfile' with following content

	    FROM mcr.microsoft.com/dotnet/sdk:5.0
	    WORKDIR /source
	   
Note: We need some process in running state inside container to keep container in running state.  If we don't have any such process & we still want to keep container in running state, we may add following entry point (a trick) in our docker file to keep container in running state 

    ENTRYPOINT ["tail", "-f", "/dev/null"] # to keep container running 

- Build Image 
	> docker build -t bilalshahzad139/mydotnet1 .


Start Container & interact with it 
- Following command will start & end the container as there is nothing which will keep it up
	> docker run --name mydotnet1 bilalshahzad139/mydotnet1

- We can start container with an interactive terminal (e.g. bash) so container will be active as long as bash terminal is running in container. **Note:** Use Ctr + PQ to go out from container without killing bash
- To run container with default shell (-it means interactive terminal)
	> docker run -it --name mydotnet1 bilalshahzad139/mydotnet1      
	
- To run container with 'bash' as default shell (-it means interactive terminal)
	> docker run -it --name mydotnet1 bilalshahzad139/mydotnet1 bash

- To run container with 'bash' shell but will not go into container instantly or will run container in background
	> docker run -it --name mydotnet1 -d bilalshahzad139/mydotnet1 bash

- Once we are out of running container, we can go back 
	> docker attach mydotnet1  
	
- OR 

	> docker exec -it mydotnet1 bash

--- Check & play with dotnet utility

- Go inside container 
	> docker exec -it mydotnet1 bash 

- Check if we've 'source' folder & 'dotnet' cli is available 
	> dotnet --help 

- Result: It should show available options 

- Just to play around, create a new console project here 
	> dotnet new console
	
	> ls 

- Restore packages 
	> dotnet restore 

- Build project 
	> dotnet build 

- Run project 
	> dotnet run 

Result: It should print "Hello world!" 

Learning: 
- We can have our Dotnet SDK in a container & can have source code outside of container (mounted) and then we can work outside container (e.g. using VSCode) and send restore/build/run commands to container

## Task 19: Create image using sdk:5.0 as base image + WORKDIR

Assumption: full path of dotnet2 => D:\dockerseries\dotnet2 (/d/dockerseries/dotnet2)

- Open dotnet2 folder in VSCode and create a new file 'Dockerfile' with following content

	    FROM mcr.microsoft.com/dotnet/sdk:5.0
	    EXPOSE 80
	    EXPOSE 443
	    EXPOSE 8080
	    EXPOSE 4443
	    WORKDIR /source

- Open a new terminal in VSCode & build Image 
	> docker build -t bilalshahzad139/mydotnet2 .

### Part 1: using dotnet run (it will build & run)

**Note:** dotnet run command is used in source code. It builds the project and run the application by using default Launcher profile or we can provide a profile to it. This option is used when we use run option in Visual Studio IDE. Also we'll have to do some extra configuraiton to run application on HTTPS.

- We've following profile in launchSettings.json file 

	    "W2Docker": {
	          "commandName": "Project",
	          "launchBrowser": true,
	          "environmentVariables": {
	            "ASPNETCORE_ENVIRONMENT": "Development"
	          },
	          "dotnetRunMessages": "true",
	          "applicationUrl": "https://*:4443;http://*:8080"
	        }

- Run container with HTTPs folder mounted so localhost (self-signed certificate) can be used internally
	> docker run --rm -it --name mydotnet2 -p 5000:8080 -p 5001:4443 -v /d/dockerseries/dotnet2/MyWebProj:/source  -v "%APPDATA%\ASP.NET\Https":/root/.aspnet/https/ bilalshahzad139/mydotnet2

- Set Env Variables inside container to define which certificate should be used from https folder and the password used to create certificate
	>	export ASPNETCORE_Kestrel__Certificates__Default__Path=/root/.aspnet/https/mywebproj.pfx
	 
	> export ASPNETCORE_Kestrel__Certificates__Default__Password="password"

- Go to cd /source && run the app
	> cd /source 
	> dotnet run --launch-profile=W2Docker

- Test in browser  => https://localhost:5001
- Test in browser  => http://localhost:5000
-- It will redirect to HTTPS & default port for https is 4443 so it has redirected to our browser to 4443
-- We need to set default HTTPS port (which we've outside) i.e. 5001

- Press Ctr + C to exit app in container 
- Set following enviornment variable in container which tells the app on which port application should use to redirect from HTTP to HTTPs
	> export ASPNETCORE_HTTPS_PORT=5001

- Run app again 
	>	 dotnet run --launch-profile=W2Docker

- Test in browser  => https://localhost:5001
- Test in browser  => http://localhost:5000

 - Press Ctr + C to exit app in container 
 - Get out from container 
	 > exit 


### Part 2: using dotnet <>.dll  

Note: dotnet <DLL> command is used to run application from compiled code. It uses default URLs to run application. In this part, we'll try to run DLL but from Debug folder.

- Run container 
	> docker run --rm -it --name mydotnet2 -p 5000:8080 -p 5001:4443 -v /d/dockerseries/dotnet2/MyWebProj:/source  -v "%APPDATA%\ASP.NET\Https":/root/.aspnet/https/ bilalshahzad139/mydotnet2

- Set Env Variables inside container
	> export ASPNETCORE_Kestrel__Certificates__Default__Path=/root/.aspnet/https/mywebproj.pfx
	 
	> export ASPNETCORE_Kestrel__Certificates__Default__Password="password"
	
	> export ASPNETCORE_URLS="https://*:4443;http://*:8080"
	
	> export ASPNETCORE_ENVIRONMENT=Development 
	
	> export ASPNETCORE_HTTPS_PORT=5001

 - Build project 
	> dotnet build 

- Go to /source/bin/Debug/net5.0
	> cd /source/bin/Debug/net5.0

- Run app 
	> dotnet MyWebProj.dll 

- Test in browser  => https://localhost:5001
- Test in browser  => http://localhost:5000

--- Result: We'll see some styling issues as we should not run this dll but the published one
- Press Ctr + C to exit app in container 
- Get out from container 
	>exit 

-------------------------------
Part 3: Pass Env Variables & Run published version 
-------------------------------
Note: In this part, we'll prepare published version of our code and then will run DLL from it. We'll also pass enviornemnt variables while running the container.

- Run container with Env Variables (--rm is used to remove the container automatically when it goes to stopped state)
	> docker run --rm -it --name mydotnet2 -p 5000:8080 -p 5001:4443 -v /d/dockerseries/dotnet2/MyWebProj:/source -v "%APPDATA%\ASP.NET\Https":/root/.aspnet/https/ -e ASPNETCORE_URLS="https://*:4443;http://*:8080" -e ASPNETCORE_HTTPS_PORT=5001 -e ASPNETCORE_ENVIRONMENT=Development -e ASPNETCORE_Kestrel__Certificates__Default__Path=/root/.aspnet/https/mywebproj.pfx -e ASPNETCORE_Kestrel__Certificates__Default__Password="password" bilalshahzad139/mydotnet2

 - Build project 
	 > dotnet build

- Publish the project output in a folder 
	 > dotnet publish "MyWebProj.csproj" -c Release -o /app/publish

- Go to /app/publish folder 
	> cd /app/publish

- Run app 
	> dotnet MyWebProj.dll

- Test in browser  => https://localhost:5001
- Test in browser  => http://localhost:5000

- Press Ctr + C to exit app in container 
- Get out from container 
	 > exit 

## Task 20: Create image with published content

Assumption: Full path of dotnet3 => D:\dockerseries\dotnet3 (/d/dockerseries/dotnet3)

- Open dotnet3 folder in VSCode and create a new file 'Dockerfile' with following content

	    FROM mcr.microsoft.com/dotnet/sdk:5.0
	    EXPOSE 8080
	    EXPOSE 4443
	    WORKDIR /source
	    COPY . . 
	    RUN dotnet build 
	    RUN dotnet publish "MyWebProj.csproj" -c Release -o /app/publish
	    WORKDIR /app/publish 
	    ENTRYPOINT ["dotnet", "MyWebProj.dll"]

- Open a new terminal in VSCode and build Image 
	> docker build -t bilalshahzad139/mydotnet3 .

- Run container with Env Variables & in de-attached mode 
	> docker run -d --name mydotnet3 -p 5000:8080 -p 5001:4443 -v /d/dockerseries/dotnet3:/source -v "D:\dockerseries\https":/root/.aspnet/https/ -e ASPNETCORE_URLS="https://*:4443;http://*:8080" -e ASPNETCORE_HTTPS_PORT=5001 -e ASPNETCORE_ENVIRONMENT=Development -e ASPNETCORE_Kestrel__Certificates__Default__Path=/root/.aspnet/https/mypersonalcert.pfx -e ASPNETCORE_Kestrel__Certificates__Default__Password="password" bilalshahzad139/mydotnet3

- Check logs of container 
	> docker logs mydotnet3

- Test in browser  => https://localhost:5001
- Test in browser  => http://localhost:5000

- Remove container 
docker rm -f mydotnet3
 
Note: We don't need SDK to run the application. Create & check donet core application with docker support in Visual Studio 2019. Dockerfile in that project shows how to use multi-stage build feature to use SDK for compilation and keep runtime (instead of SDK) in final image.


## Task 21: Create image for .NET Framework with published content

Observation & Question: We can use .NET Core applications inside a container as .net core supports Linux but what about .NET Framework applications which only run on windows? 
Answer: We've windows containers which runs only on a Windows host as containers share host OS kernel. So for .NET Framework based applications, we'll have to use windows containers. We'll have to switch from "Linux Containers" to "Windows Containers" in "Docker Desktop" It may ask you to enable Hyper-V in windows features & then may ask for a restart.  Check https://docs.microsoft.com/en-us/virtualization/windowscontainers/quick-start/set-up-environment?tabs=Windows-Server for more details.

### Part 1: Running a sample aspnet app

- Pull following image 
	>docker pull mcr.microsoft.com/dotnet/framework/aspnet:4.8

- Run container 
	> docker run --name aspnet_sample --rm -it -p 8000:80 mcr.microsoft.com/dotnet/framework/samples:aspnetapp

- Test in browser http://localhost:8000

- Connect to container 
	> docker exec -it aspnet_sample cmd 

- Check folder structure, it should be windows based & www folder 
- Stop container 
	> exit 

- Run container with mounted folder 
	> docker run --name aspnet_sample --rm -it -p 8000:80 -v "d:\dockerseries:c:\dock:ro" mcr.microsoft.com/dotnet/framework/samples:aspnetapp

- Connect to container 
	> docker exec -it aspnet_sample cmd 

- check folder structure e.g. c:\dock 
	> cd c:\dock 
	
	> dir 


### Part 2: Build image with ASP.NET MVC application 

Assumption: Full path of dotnet4 => D:\dockerseries\dotnet4 (/d/dockerseries/dotnet4)

- Pull following image 
docker pull mcr.microsoft.com/dotnet/framework/sdk:4.8

- Open dotnet4 folder in VSCode and create a new file Dockerfile with following content. Note: Here we are using multi-stage build feature

	    FROM mcr.microsoft.com/dotnet/framework/sdk:4.8 as build
	    WORKDIR /app/src
	    COPY src/. /app/src/
	    RUN nuget restore
	    RUN msbuild /p:Configuration=Release
	    FROM mcr.microsoft.com/dotnet/framework/aspnet:4.8 AS runtime
	    WORKDIR /inetpub/wwwroot
	    COPY --from=build /app/src/. ./

- Open a new terminal and build an image 
	> docker biuld -t bilalshahad139/mydotnet4 . 

- Run container 
	> docker run --rm -it --name mydotnet4 -p 8080:80 bilalshahzad139/mydotnet4

- Test in browser http://localhost:8080

### Part 3: Create Website in IIS & configure SSL

Assumption: Full path of dotnet5 => D:\dockerseries\dotnet5 (/d/dockerseries/dotnet5)

- Open dotnet5 folder in VSCode and create a new file "Dockerfile" with following content 

	    FROM mcr.microsoft.com/dotnet/framework/sdk:4.8 as build
	    WORKDIR /app/src
	    COPY src/. /app/src/
	    RUN nuget restore
	    RUN msbuild /p:Configuration=Release
	    FROM mcr.microsoft.com/dotnet/framework/aspnet:4.8 AS runtime
	    EXPOSE 443
	    WORKDIR /Https
	    COPY aspnetapp.pfx .
	    WORKDIR /MyApp
	    COPY --from=build /app/src/. ./
	    RUN Remove-WebSite -Name 'Default Web Site'
	    RUN New-Website -Name 'MyApp' -IPAddress '*' -Port 443 -PhysicalPath C:\MyApp -ApplicationPool '.NET v4.5' -Ssl -SslFlags 0
	    RUN powershell.exe -Command "\
	      # The following 2 imports are necessary to do the below SslBindings ; \
	      Import-Module IISAdministration; \
	      Import-Module WebAdministration; \
	      # If you have a password on your SSL Cert, put it here as it needs "secured". If not, remove this line and the argument below it; \
	      $pwd = ConvertTo-SecureString -String 'password' -Force -AsPlainText; \
	      # Import the certificate and store it in a variable to bind to later; \
	      $cert = Import-PfxCertificate -Exportable -FilePath 'C:\https\aspnetapp.pfx' -CertStoreLocation cert:\localMachine\My -Password $pwd; \
	      # Take the imported certificate and bind it to all traffic toward port 443 (you need to specify IP if you want multiple apps on 1 docker which I believe is ill-advised); \
	      new-item -Path IIS:\SslBindings\0.0.0.0!443 -value $cert;"

- We are doing following tasks in above Dockerfile
-- Restore Packages
-- Build Application
-- Build Release using msbuild
-- Remove existing 'Default Web Site' from IIS Using Powershell commands
-- Create a new website in IIS with default HTTPs Port & folder path
-- And then we are providing SSL certificate detail using Powershell commands

- Open a new terminal in VScode 
	> docker build -t bilalshahzad139/mydotnet5 .

- Run a container 
	> docker run --name mydotnet5 -p 4443:443 bilalshahzad139/mydotnet5

- Test in browser https://localhost:4443
