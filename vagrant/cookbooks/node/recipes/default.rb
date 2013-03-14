build_tools = %w{make g++}

packages = [ build_tools ]

packages.flatten.each do |a_package|
  package a_package
end

download_dir = node[:nodejs][:download_dir]
revision = node[:nodejs][:revision]

git "#{download_dir}/nodejs" do
  repository "git://github.com/joyent/node.git"
  revision "#{revision}"
  action :sync
end

execute "configure nodejs" do
  cwd "#{download_dir}/nodejs"
  command "./configure"
  creates "#{download_dir}/nodejs/config.mk"
end

execute "make nodejs" do
  cwd "#{download_dir}/nodejs"
  command "make"
  creates "#{download_dir}/nodejs/out"
end

execute "make install nodejs" do
  cwd "#{download_dir}/nodejs"
  command "make install"
  creates "/usr/local/bin/node"
end
