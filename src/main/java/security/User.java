package security;

/**
 * 用户和管理员的操作除“添加用户”之外完全一样。“添加用户”功能大多用于业务环节，其中为不同用户设置不同角色如果用角色的uuid代码辨识度太低，
 * 所以“添加用户”和“添加管理员”的区别在于，“添加管理员”使用的是角色的uuid，而“添加用户”使用的是角色名称。另外，用户模块和业务关联度太
 * 高，所以不在此文件中实现。
 */
public final class User {
    public User() {
    }
}