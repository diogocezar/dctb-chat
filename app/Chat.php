<?php
    /**
    *   Chat
    *   Class to manage server side Chat
    *   Author: Diogo Cezar Teixeira Batista
    *   Year: 2015
    */
    Class Chat{

    	/**
    	* Attribute to store type of chat
    	*/
    	private $chat_type = null;

        /**
        * Attribute to store chat conversation
        */
        private $file = null;

        /**
        * Attribute to users
        */
        private $file_nicks = "../data/chat_users.txt";

        /**
        * Number of history conversations to restore
        */
        private $history = 10;

        /**
        * Attribute to store an instance of PageBuilder
        */
        private static $instance = null;

        /**
        * Method that returns an instance
        */
        public static function getInstance(){
            if (!isset(self::$instance) && is_null(self::$instance)) {
                $c = __CLASS__;
                self::$instance = new $c;
            }
            return self::$instance;
        }

        /**
        * Private constructor to prevent direct criation
        */
        private function __construct(){}

        public function setFile(){
        	if($this->chat_type == "php"){
        		$this->file = "../data/chat_php.txt";
        	}
        	else{
        		$this->file = "../data/chat_nodejs.txt";
        	}
        }

        /**
        * Method to return the number of lines in file_php
        */
        public function getState(){
        	$this->chat_type = "php";
        	if(!empty($_POST['type']))
        		$this->chat_type = $_POST['type'];
        	$this->setFile();
            if(file_exists($this->file)){
                $lines = file($this->file);
            }
            $return['state'] = count($lines);
            echo json_encode($return);
        }

        /**
        * Method to return the history of chat
        */
        public function getHistory(){
			$this->chat_type = "php";
        	if(!empty($_POST['type']))
        		$this->chat_type = $_POST['type'];
        	$this->setFile();
            $state = $_POST['state'];
            if(!empty($_POST['history']))
                $history = $_POST['history'];
            else
                $history = $this->history;
            if(file_exists($this->file)){
               $lines = file($this->file);
            }
            $count = count($lines);
            if($history > $count){
                $history = $count;
            }
            $text = array();
            foreach ($lines as $line_num => $line){
                if($line_num >= ($state-$history)){
                    $text[] =  $line = str_replace("\n", "", $line);
                }
            }
            $return['text'] = $text;
            echo json_encode($return);
        }

        /**
        * Method to update chat
        */
        public function update(){
			$this->chat_type = "php";
        	if(!empty($_POST['type']))
        		$this->chat_type = $_POST['type'];
        	$this->setFile();
            $state = $_POST['state'];
            if(file_exists($this->file)){
               $lines = file($this->file);
            }
            $count = count($lines);
            if($state == $count){
                $return['state'] = $state;
                $return['text'] = false;
            }
            else{
                $text = array();
                $return['state'] = $state + count($lines) - $state;
                foreach ($lines as $line_num => $line){
                    if($line_num >= $state){
                        $text[] =  $line = str_replace("\n", "", $line);
                    }
                }
                $return['text'] = $text; 
            }
            echo json_encode($return);
        }
        /**
        * Method to send a message
        */
        public function send(){
			$this->chat_type = "php";
        	if(!empty($_POST['type']))
        		$this->chat_type = $_POST['type'];
        	$this->setFile();
            $file = $this->file;
            $nickname  = htmlentities(strip_tags($_POST['nickname']));
            $reg_exUrl = "/(http|https|ftp|ftps)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?/";
            $message   = htmlentities(strip_tags($_POST['message']));
            if(($message) != "\n"){
                if(preg_match($reg_exUrl, $message, $url)){
                    $message = preg_replace($reg_exUrl, '<a href="'.$url[0].'" target="_blank">'.$url[0].'</a>', $message);
                }
                if(fwrite(fopen($file, 'a'), "<span class=\"span-chat date\">". date('d/m/Y H:i:s') . "</span>" . "<span class=\"span-chat\">". $nickname . "</span>" . $message = str_replace("\n", " ", $message) . "\n"))
                    echo "{\"success\":\"true\"}";
                else
                    echo "{\"success\":\"false\"}";
            }
        }
    }
    if(isset($_GET['method'])){
        $method = $_GET['method'];
        if(!empty($method)){
            $instance = Chat::getInstance();
            $instance->{$method}();
        }
    }
?>