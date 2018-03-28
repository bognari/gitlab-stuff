#!/usr/bin/env ruby

require 'git'

args = ARGF.gets.to_s.split(' ')

old = args[0]
new = args[1]

g = Git.open(Dir.pwd, :log => Logger.new(STDOUT))

value = g.diff(old, new).to_s

#value = %x("git diff --name-only #{old} #{new} 2>&1")

file = File.new('/home/ubuntu/gitlab.log', 'w+')
file.write(old + "\n")
file.write(new + "\n")
file.write(value + "\n")
file.write(Dir.pwd.to_s + "\n")
file.close
