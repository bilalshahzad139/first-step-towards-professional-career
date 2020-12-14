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