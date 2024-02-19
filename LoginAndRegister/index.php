<?php

include 'config.php';
session_start();

?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="login.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
    <title>Login</title>
</head>

<body>

    <!-- main section -->
    <section id="auth_section">

        <div class="title">
        <img class="title" src="title.png" alt="title">
        </div>

        <div class="auth_container">
            <!--============ login =============-->

            <div id="Log_in">
                <h2>Log In</h2>

                <!-- // ==userlogin== -->
                <?php 
                if (isset($_POST['user_login_submit'])) {
                    $Email = $_POST['Email'];
                    $Password = $_POST['Password'];

                    $sql = "SELECT * FROM user_login WHERE Email = '$Email' AND Password = BINARY'$Password'";
                    $result = mysqli_query($conn, $sql);

                    if ($result->num_rows > 0) {
                        $_SESSION['userEmail'] = $Email;
                        $Email = "";
                        $Password = "";
                        header("Location: home.php");
                    } else {
                        echo "<script>alert('User Does not Exist');</script>";
                    }
                }
                ?>
                <form class="user_login authsection active" id="userlogin" action="" method="POST">
                    <div class="form-floating">
                        <input type="text" class="form-control" name="Username" placeholder=" ">
                        <label for="Username">Username</label>
                    </div>
                    <div class="form-floating">
                        <input type="password" class="form-control" name="Password" placeholder=" ">
                        <label for="Password">Password</label>
                    </div>
                    <button type="submit" name="user_login_submit" class="auth_btn">Log in</button>
                    <div class="footer_line">
                        <h6>Don't have an account? <span class="page_move_btn" onclick="signuppage()">sign up</span></h6>
                    </div>
                </form>
                
            </div>

            <!--============ signup =============-->
            <?php       
                if (isset($_POST['user_signup_submit'])) {
                    $fName = $_POST['lName'];
                    $lName = $_POST['fName'];
                    $Username = $_POST['Username'];
                    $Email = $_POST['Email'];
                    $Password = $_POST['Password'];
                    $CPassword = $_POST['CPassword'];

                    if($lName == "" || $fName == "" || $Username == "" || $Email == "" || $Password == ""){
                        echo "<script>alert('Fill the proper details');</script>";
                    }
                    else{
                        if ($Password == $CPassword) {
                            $sql = "SELECT * FROM user_login WHERE Email = '$Email'";
                            $result = mysqli_query($conn, $sql);
    
                            if ($result->num_rows > 0) {
                                echo "<script>alert('Email already exist');</script>";
                            } else {
                                $sql = "INSERT INTO user_login (Username,Email,Password) VALUES ('$lName', '$fName', '$Username', '$Email', '$Password')";
                                $result = mysqli_query($conn, $sql);
    
                                if ($result) {
                                    $_SESSION['userEmail']=$Email;
                                    $fName = "";
                                    $lName = "";
                                    $Username = "";
                                    $Email = "";
                                    $Password = "";
                                    $CPassword = "";
                                    header("Location: home.php");
                                } else {
                                    echo "<script>alert('User does not exist');</script>";
                            }
                        } if ($Password != $CPassword){
                            echo "<script>alert('Password does not matched');</script>";
                        }
                    }
                    
                }
            }
            ?>
            <div id="sign_up">
                <h2>Sign Up</h2>

                <form class="user_signup" id="usersignup" action="" method="POST">
                <div class="form-floating">
                        <input type="text" class="form-control" name="fName" placeholder=" ">
                        <label for="fName">First Name</label>
                    </div>
                    <div class="form-floating">
                        <input type="lName" class="form-control" name="lName" placeholder=" ">
                        <label for="lName">Last Name</label>
                    </div>
                    <div class="form-floating">
                        <input type="text" class="form-control" name="Username" placeholder=" ">
                        <label for="Username">Username</label>
                    </div>
                    <div class="form-floating">
                        <input type="email" class="form-control" name="Email" placeholder=" ">
                        <label for="Email">Email</label>
                    </div>
                    <div class="form-floating">
                        <input type="password" class="form-control" name="Password" placeholder=" ">
                        <label for="Password">Password</label>
                    </div>
                    <div class="form-floating">
                        <input type="password" class="form-control" name="CPassword" placeholder=" ">
                        <label for="CPassword">Confirm Password</label>
                    </div>

                    <button type="submit" name="user_signup_submit" class="auth_btn">Sign up</button>

                    <div class="footer_line">
                        <h6>Already have an account? <span class="page_move_btn" onclick="loginpage()">Log in</span></h6>
                    </div>
                </form>
            </div>
    </section>
</body>


<script src="./javascript/index.js"></script>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>

</html>

