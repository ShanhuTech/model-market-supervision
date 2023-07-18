[1]运行：npm install -D tailwindcss
[2]运行：npx tailwindcss init
[3]在配置文件tailwind.config.js中的content添加编译路径："../../**/*.{html,js}"
[4]运行批处理watch.bat

如果运行时提示：warn - The utility `w-[calc(100%-theme('spacing[some_key][1.5]')
)]` contains an invalid theme value and was not generated.
是因为在配置文件tailwind.config.js中的content添加编译路径会包含当前的node_module
s目录，而里面的html和js文件导致的这个问题。不影响最终的代码生成，可以忽略。
