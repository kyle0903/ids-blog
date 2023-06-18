const express = require("express");
const db = require("./config/db");
const config = require("./config/token");
const cors = require("cors");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const app = express();
const PORT = 8081;
var crypto = require("crypto");
const { post } = require("jquery");
app.use(cors());
app.use(express.json());

// Route to get all posts
app.get("/api/get/all", (req, res) => {
  db.query(
    "SELECT * FROM posts INNER JOIN accounts ON posts.account_id = accounts.id ORDER BY posts.date_posted DESC",
    (err, result) => {
      if (err) {
        console.log(err);
      }
      res.send(result);
    }
  );
});
//獲取帳號資訊
app.get("/api/get/user/:id", (req, res) => {
  const id = req.params.id;
  db.query("SELECT user FROM accounts where id = ?", id, (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send(result);
  });
});
// 獲取歷史文章
app.get("/api/get/post/:id", (req, res) => {
  const id = req.params.id;
  db.query(
    "SELECT * FROM posts INNER JOIN accounts ON posts.account_id = accounts.id where accounts.id = ? ORDER BY posts.date_posted DESC",
    id,
    (err, result) => {
      if (err) {
        console.log(err);
      }
      res.send(result);
    }
  );
});
// Route to get one post
app.get("/api/getFromId/:id", (req, res) => {
  const id = req.params.id;
  db.query("SELECT * FROM posts WHERE id = ?", id, (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send(result);
  });
});

// Route for creating the post
app.post("/api/create", (req, res) => {
  const username = req.body.userName;
  const title = req.body.title;
  const text = req.body.text;
  const date_posted = req.body.date_posted;

  db.query(
    "SELECT * FROM accounts WHERE user = ? ",
    username,
    (err, result) => {
      if (err) {
        console.log(err);
      }
      db.query(
        "INSERT INTO posts (title, post_text,date_posted,account_id) VALUES (?,?,?,?)",
        [title, text, date_posted, result[0].id],
        (err, result0) => {
          if (err) {
            console.log(err);
            res.send({
              state: "failed",
              message: "發佈貼文時可能發生一點問題",
            });
          }
          console.log(result0);
          res.send({ state: "success", message: "成功發佈貼文！" });
        }
      );
    }
  );
});

// Route to like a post
app.post("/api/like", (req, res) => {
  const id = req.body.id;
  const id_post = req.body.id_post;
  db.query(
    "SELECT * FROM tb_likes WHERE post_id = ? AND account_id = ?",
    [id_post, id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else if (result.length == 0) {
        db.query(
          "UPDATE posts SET likes = likes + 1 WHERE post_id = ?",
          id_post,
          (err, result1) => {
            if (err) {
              console.log(err);
            } else {
              db.query(
                "INSERT INTO tb_likes (post_id,account_id) VALUES (?,?)",
                [id_post, id],
                (err, result2) => {
                  if (err) {
                    console.log(err);
                  } else {
                    res.send({ state: "new" });
                  }
                }
              );
            }
          }
        );
      } else {
        db.query(
          "UPDATE posts SET likes = likes - 1 WHERE post_id = ?",
          id_post,
          (err, result3) => {
            if (err) {
              console.log(err);
            } else {
              db.query(
                "DELETE FROM tb_likes WHERE post_id= ? AND account_id=?",
                [id_post, id],
                (err, result4) => {
                  if (err) {
                    console.log(err);
                  } else {
                    res.send({ state: "delete" });
                  }
                }
              );
            }
          }
        );
      }
    }
  );
});
//取得特定用戶按讚之內容
app.get("/api/get/like/:id", (req, res) => {
  const id = req.params.id;
  db.query(
    "SELECT * FROM posts INNER JOIN tb_likes on posts.post_id = tb_likes.post_id  INNER JOIN accounts ON posts.account_id = accounts.id where tb_likes.account_id = ?",
    id,
    (err, result) => {
      if (err) {
        console.log(err);
      }
      res.send(result);
    }
  );
});
//取得特定用戶按過的讚;
app.post("/api/get/like", (req, res) => {
  const userid = req.body.userid;
  db.query(
    "SELECT * FROM tb_likes WHERE account_id = ?",
    userid,
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

// Route to delete a post
app.post("/api/delete", (req, res) => {
  const id = req.body.id;
  db.query("DELETE FROM posts WHERE post_id= ?", id, (err, result) => {
    if (err) {
      console.log(err);
      res.send({ state: "failed", message: "刪除過程中出了點問題" });
    } else {
      res.send({ state: "success", message: "正在刪除中..." });
    }
  });
});

//sign up
app.post("/api/sign", (req, res) => {
  const user = req.body.user;
  var password = req.body.password;
  const email = req.body.email;
  password = bcrypt.hashSync(password, 10);
  db.query("SELECT user FROM accounts where user=?", user, (err, result) => {
    if (err) {
      console.log(err);
    }
    if (result.length == 0) {
      db.query(
        "INSERT INTO accounts (user,password,email) VALUES (?,?,?)",
        [user, password, email],
        (err, result) => {
          if (err) {
            console.log(err);
          }
          console.log(result);
          res.send("恭喜你！註冊成功！");
        }
      );
    } else {
      res.send("帳戶已存在，請另外申請");
    }
  });
});
//log in
app.post("/api/login", (req, res) => {
  const user = req.body.user;
  const password = req.body.password;
  console.log(user, password);
  db.query("SELECT * FROM accounts where user=?  ", user, (err, result) => {
    if (err) {
      console.log(err);
    }
    if (result.length == 0) {
      res.send({
        state: "failed",
        message: "您輸入的帳號或密碼有誤！",
      });
    } else {
      console.log(result[0].password);
      console.log(password);
      const psRes = bcrypt.compareSync(password, result[0].password);
      console.log(psRes); // 將使用者輸入的密碼和存在資料庫的密碼進行比較
      if (!psRes) {
        res.send({
          state: "failed",
          message: "您輸入的帳號或密碼有誤！",
        });
      } else {
        const payload = {
          id: result[0].id,
          user: result[0].user,
        };
        const token = jwt.sign(payload, config.jwtKey, { expiresIn: "24h" }); // generate token based on username
        // return the token
        res.send({
          state: "success",
          message: "登入中...",
          token,
          id: result[0].id,
        });
      }
    }
  });
});
//驗證token
app.post("/api/token", (req, res) => {
  token = req.body.token;

  jwt.verify(token, config.jwtKey, function (err, decoded) {
    if (err) {
      res.send(false); // 失敗時回傳 Unauthorized 錯誤訊息
    } else {
      res.send(decoded); // 將解密後token回傳
    }
  });
});

//忘記密碼寄信
app.post("/api/email", (req, res) => {
  function sendmail(email, rand) {
    var htmls =
      "請點擊<a href='http://localhost:5001/" +
      rand +
      "'>這個連結</a>修改您的密碼";
    var mail = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "ha10966001@gmail.com", // Your email id
        pass: "junkai0903", // Your password
      },
    });
    var mailOptions = {
      from: "ha10966001@gmail.com",
      to: email,
      subject: "Reset Password Link - Tutsmake.com",
      html: htmls,
    };

    mail.sendMail(mailOptions, function (error, info) {
      if (error) {
        res.send(error);
      } else {
        console.log(0);
      }
    });
  }

  var email = req.body.email;
  var user = req.body.user;
  db.query("SELECT * FROM accounts where user  =?", user, (err, result) => {
    if (err) {
      console.log(err);
      res.send({
        state: "failed",
        message: "帳戶或信箱有誤",
      });
    } else if (result.length == 1) {
      var respond = JSON.parse(JSON.stringify(result));
      var rand = crypto.randomBytes(32).toString("hex");
      db.query(
        "DELETE FROM random_table WHERE account_id=?",
        result[0].id,
        (err, result1) => {
          if (err) {
            console.log(err);
          } else {
            db.query(
              "INSERT INTO random_table (randomCode,account_id) VALUES (?,?)",
              [rand, result[0].id],
              (err, result2) => {
                if (err) {
                  console.log(err);
                } else {
                  sendmail(email, rand);
                  res.send({
                    state: "success",
                    message: "麻煩前往信箱修改密碼",
                  });
                }
              }
            );
          }
        }
      );
    } else {
      res.send({
        state: "failed",
        message: "帳戶或信箱有誤",
      });
    }
  });
});
//忘記密碼亂碼驗證
app.get("/api/forget/:validcode", (req, res) => {
  const validcode = req.params.validcode;
  db.query(
    "SELECT * FROM random_table WHERE randomCode = ?",
    validcode,
    (err, result) => {
      if (err) {
        console.log(err);
      } else if (result.length == 1) {
        console.log(result);
        db.query(
          "SELECT user FROM accounts WHERE id=?",
          result[0].account_id,
          (err, result1) => {
            if (err) {
              console.log(err);
            } else {
              res.send({
                state: "success",
                user: result1[0].user,
              });
            }
          }
        );
      } else {
        res.send({
          state: "failed",
          message: "連結已過期",
        });
      }
    }
  );
});
//忘記密碼最後檢查
app.post("/api/forget_check", (req, res) => {
  let password = req.body.password;
  const user = req.body.user;
  db.query("SELECT id FROM accounts WHERE user=?", user, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      db.query(
        "DELETE FROM random_table WHERE account_id=? ",
        result[0].id,
        (err, result1) => {
          if (err) {
            console.log(err);
          } else {
            password = bcrypt.hashSync(password, 10);
            db.query(
              "UPDATE accounts SET password=? WHERE user=?",
              [password, user],
              (err, result) => {
                if (err) {
                  console.log(err);
                } else {
                  res.send({ state: "success", message: "密碼更改成功!" });
                }
              }
            );
          }
        }
      );
    }
  });
});
//編輯文章
app.post("/api/edit", (req, res) => {
  const title = req.body.title;
  const text = req.body.text;
  const id = req.body.id;
  db.query(
    "UPDATE posts SET title = ? , post_text = ? WHERE post_id = ?",
    [title, text, id],
    (err, result) => {
      if (err) {
        console.log(err);
        res.send({ state: "failed", message: "無法修改文章" });
      } else {
        res.send({ state: "success", message: "修改文章中..." });
      }
    }
  );
});
//發佈留言
app.post("/api/insert/comment", (req, res) => {
  const postid = req.body.postid;
  const comment = req.body.comment;
  const user = req.body.user;
  db.query(
    "INSERT INTO tb_comment(post_id,comment,account) VALUES(?,?,?)",
    [postid, comment, user],
    (err, result) => {
      if (err) {
        console.log(err);
        res.send({ state: "failed", message: "發佈留言時發生錯誤" });
      } else {
        db.query(
          "SELECT * FROM tb_comment INNER JOIN accounts ON tb_comment.account = accounts.user ",
          (err, result) => {
            if (err) {
              console.log(err);
            } else {
              res.send({
                state: "success",
                message: "成功發佈留言",
                info: result,
              });
            }
          }
        );
      }
    }
  );
});
//取得留言資料
app.get("/api/get/comment", (req, res) => {
  db.query(
    "SELECT * FROM tb_comment INNER JOIN accounts ON tb_comment.account = accounts.user ",
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});
//取得簡介資料
app.get("/api/get/intro/:id", (req, res) => {
  const id = req.params.id;
  db.query(
    "SELECT introduction FROM accounts WHERE id = ? ",
    id,
    (err, result) => {
      if (err) {
        res.send({ state: "failed", message: "發生錯誤" });
      } else {
        if (result.length == 0) {
          res.send({ state: "logout", message: "請先登入您的帳戶" });
        } else {
          if (result[0].introduction == "") {
            res.send({ state: "success", message: "我還沒準備好介紹自己" });
          } else {
            res.send({ state: "success", message: result[0].introduction });
          }
        }
      }
    }
  );
});
//編輯簡介
app.post("/api/intro", (req, res) => {
  const intro = req.body.intro;
  const id = req.body.id;
  db.query(
    "UPDATE accounts SET introduction = ? WHERE id = ?",
    [intro, id],
    (err, result) => {
      if (err) {
        console.log(err);
        res.send({ state: "failed", message: "無法修改文章" });
      } else {
        console.log(result);
        res.send({ state: "success", message: "修改文章中..." });
      }
    }
  );
});
//更改密碼
app.post("/api/changepwd", (req, res) => {
  const loginId = req.body.loginId;
  const originPwd = req.body.originPwd;
  const pwdChange = req.body.pwdChange;
  const pwdCheck = req.body.pwdCheck;

  db.query(
    "SELECT password FROM accounts WHERE id = ?",
    loginId,
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        const psRes = bcrypt.compareSync(originPwd, result[0].password);
        if (psRes) {
          if (pwdChange == pwdCheck) {
            let pwd = bcrypt.hashSync(pwdChange, 10);
            db.query(
              "UPDATE accounts SET password = ? WHERE id = ?",
              [pwd, loginId],
              (err, result1) => {
                if (err) {
                  console.log(err);
                } else {
                  res.send({
                    state: "success",
                    message: "成功修改密碼，將自動登出",
                  });
                }
              }
            );
          } else {
            res.send({ state: "failed", message: "密碼不一致" });
          }
        } else {
          res.send({ state: "failed", message: "原密碼有誤" });
        }
      }
    }
  );
});
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
