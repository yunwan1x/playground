# java tools

```shell
-rwxr-xr-x. 1 root root  13280 Oct 27 22:04 alt-java
-rwxr-xr-x. 1 root root  13232 Oct 27 22:04 jaotc
-rwxr-xr-x. 1 root root  13216 Oct 27 22:04 jar
-rwxr-xr-x. 1 root root  13224 Oct 27 22:04 jarsigner
-rwxr-xr-x. 1 root root  13192 Oct 27 22:04 java
-rwxr-xr-x. 1 root root  13248 Oct 27 22:04 javac
-rwxr-xr-x. 1 root root  13256 Oct 27 22:04 javadoc
-rwxr-xr-x. 1 root root  13216 Oct 27 22:04 javap
-rwxr-xr-x. 1 root root  13216 Oct 27 22:04 jcmd
-rwxr-xr-x. 1 root root  13272 Oct 27 22:04 jconsole
-rwxr-xr-x. 1 root root  13216 Oct 27 22:04 jdb
-rwxr-xr-x. 1 root root  13224 Oct 27 22:04 jdeprscan
-rwxr-xr-x. 1 root root  13216 Oct 27 22:04 jdeps
-rwxr-xr-x. 1 root root  13216 Oct 27 22:04 jfr
-rwxr-xr-x. 1 root root  13216 Oct 27 22:04 jhsdb
-rwxr-xr-x. 1 root root  13224 Oct 27 22:04 jimage
-rwxr-xr-x. 1 root root  13248 Oct 27 22:04 jinfo
-rwxr-xr-x. 1 root root  13248 Oct 27 22:04 jjs
-rwxr-xr-x. 1 root root  13248 Oct 27 22:04 jlink
-rwxr-xr-x. 1 root root  13248 Oct 27 22:04 jmap
-rwxr-xr-x. 1 root root  13216 Oct 27 22:04 jmod
-rwxr-xr-x. 1 root root  13216 Oct 27 22:04 jps
-rwxr-xr-x. 1 root root  13256 Oct 27 22:04 jrunscript
-rwxr-xr-x. 1 root root  13224 Oct 27 22:04 jshell
-rwxr-xr-x. 1 root root  13256 Oct 27 22:04 jstack
-rwxr-xr-x. 1 root root  13216 Oct 27 22:04 jstat
-rwxr-xr-x. 1 root root  13224 Oct 27 22:04 jstatd
-rwxr-xr-x. 1 root root  13224 Oct 27 22:04 keytool
-rwxr-xr-x. 1 root root  13224 Oct 27 22:04 pack200
-rwxr-xr-x. 1 root root  13216 Oct 27 22:04 rmic
-rwxr-xr-x. 1 root root  13216 Oct 27 22:04 rmid
-rwxr-xr-x. 1 root root  13224 Oct 27 22:04 rmiregistry
-rwxr-xr-x. 1 root root  13224 Oct 27 22:04 serialver
-rwxr-xr-x. 1 root root 121928 Oct 27 22:04 unpack200
```

# jar常用命令

1. [grepjar](https://man.archlinux.org/man/extra/fastjar/grepjar.1.en)
2. java [**Visualvm**](https://visualvm.github.io/)  all in one debugger for jvm
3. 集算器spl
4. [apache calcite](https://calcite.apache.org/)

# maven

1. [去除重复依赖插件](https://juejin.cn/post/7046946791710785544)
2. 插件列表 maven.apache.org/plugins/index.html，
3. [com/artifact/org](https://mvnrepository.com/artifact/org.codehaus.mojo?p=2)

```shell
mvn dependency:list
mvn dependency:get -DremoteRepositories=http://119.42.227.56/repository/maven-releases
-DgroupId=com.alipay.sofa -DartifactId=sofaboot-enterprise-dependencies -Dversion=3.4.5
-Dtransitive=false

mvn dependency:resolve
mvn clean compile -Dmaven.test.skip=true  -s ~/.m2/test/settings.xml

[mvn管理依赖](https://www.jianshu.com/p/28f51dbab8de)

mvn dependency:get -Dartifact=org.riversun:random-forest-codegen:1.0.0

mvn help:system
mvn help:describe -Dplugin=compiler

mvn help:describe -Dplugin=groupId:artifactId:version

mvn dependency:help
mvn dependency:copy
```


## 常用插件

maven-shade-plugin 创建可执行jar

## mvn 网站

1. https://maven.apache.org/plugins/index.html
2. mvn prefix使用 https://stackoverflow.com/questions/40205664/how-does-maven-plugin-prefix-resolution-work-why-is-it-resolving-findbugs-but
