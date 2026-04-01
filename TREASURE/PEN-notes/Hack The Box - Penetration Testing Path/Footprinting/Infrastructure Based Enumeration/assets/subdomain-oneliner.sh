curl -s "https://crt.sh/?q=$1&output=json" | jq | grep "common_name" | sort -u | awk -F '"' '/",/ {print $4}' | tee subd.txt
read -p $'\033[1;31mDo you want to resolve these HOSTNAME to their IP (y/n)?\033[0m ' result
result=${result,,}
website=$(echo $1 | awk -F'.' '{print $1}')
if [[ "$result" == "y" ]]; then
	for i in $(cat subd.txt); do host "$i" | grep "has address" | grep "$website" | awk '{print $1,"=>","\033[1;37m"$4"\033[0m"}'; done | tee ip.txt
else
	echo "have a nice enumration :)"
fi

