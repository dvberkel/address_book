test_tools = %w{curl}

packages = [test_tools]

packages.flatten.each do |a_package|
  package a_package
end

download_dir = node[:project][:download_dir]

git "#{download_dir}/address_book" do
  repository "git://github.com/dvberkel/address_book.git"
  action :sync
  user "vagrant"
  group "vagrant"
end

execute "install dependencies" do
  cwd "#{download_dir}/address_book"
  command "npm install"
end
