<?php
    /**
    *   Chat
    *   Class to manage server side Chat
    *   Author: Diogo Cezar Teixeira Batista
    *   Year: 2015
    */
    Class Chat{

        /**
        * Attrivute to store normal chat conversation
        */
        private $file_php = "../data/chat_php.txt";

        /**
        * Attrivute to store nodejs chat conversation
        */
        private $file_node = "../data/chat_nodejs.txt";

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

        /**
        * Method to return the number of lines in file_php
        */
        public function getState(){
            if(file_exists($this->file_php)){
                $lines = file($this->file_php);
            }
            $return['state'] = count($lines);
            echo json_encode($return);
        }

        /**
        * Method to return the history of chat
        */
        public function getHistory(){
            $state   = $_POST['state'];
            if(!empty($_POST['history']))
                $history = $_POST['history'];
            else
                $history = $this->history;
            if(file_exists($this->file_php)){
               $lines = file($this->file_php);
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
            $state = $_POST['state'];
            if(file_exists($this->file_php)){
               $lines = file($this->file_php);
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
            $file      = $this->file_php;
            if(!empty($_POST['file'])){
                $file = "../data/chat_" . $_POST['file'] . ".txt";
            }
            $nickname  = htmlentities(strip_tags($_POST['nickname']));
            $reg_exUrl = "/(http|https|ftp|ftps)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?/";
            $message   = htmlentities(strip_tags($_POST['message']));
            if(($message) != "\n"){
                if(preg_match($reg_exUrl, $message, $url)){
                    $message = preg_replace($reg_exUrl, '<a href="'.$url[0].'" target="_blank">'.$url[0].'</a>', $message);
                }
                if(fwrite(fopen($file, 'a'), "<span class=\"date\">". date('d/m/Y H:i:s') . "</span>" . "<span>". $nickname . "</span>" . $message = str_replace("\n", " ", $message) . "\n"))
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